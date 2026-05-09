import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { authService } from './auth.service';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  code?: string;
}

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _retryCount?: number;
}

class ApiError extends Error {
  public status: number;
  public code?: string;
  public validationErrors?: Record<string, string[]>;

  constructor(
    message: string,
    status: number,
    code?: string,
    validationErrors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.validationErrors = validationErrors;
    this.message = message || 'An unexpected error occurred';
  }
}

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const handleError = (error: unknown): never => {
  const axiosError = error as AxiosError<ErrorResponse>;
  if (axiosError.response) {
    const status = axiosError.response.status;
    const message = axiosError.response.data?.message;
    const code = axiosError.response.data?.code;
    const validationErrors = axiosError.response.data?.errors;

    throw new ApiError(message || getDefaultErrorMessage(status), status, code, validationErrors);
  }
  if (axiosError.request) {
    throw new ApiError('Network Error: Please check your internet connection', 0);
  }
  throw new ApiError('An unexpected error occurred', 0);
};

const getDefaultErrorMessage = (status: number): string => {
  switch (status) {
    case 400:
      return 'The request was invalid. Please check your input.';
    case 401:
      return 'Your session has expired. Please log in again.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return 'This operation could not be completed due to a conflict.';
    case 422:
      return 'The submitted data was invalid.';
    case 429:
      return 'Too many requests. Please try again later.';
    case 500:
      return 'An internal server error occurred. Please try again later.';
    case 503:
      return 'The service is temporarily unavailable. Please try again later.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    const axiosError = error as AxiosError;
    const originalRequest = axiosError.config as ExtendedAxiosRequestConfig;
    if (!originalRequest) {
      return Promise.reject(handleError(error));
    }

    // Handle 401 Unauthorized errors
    if (axiosError.response?.status === 401 && !originalRequest._retry) {
      // Don't retry if this is already a refresh token request
      if (originalRequest.url?.includes('/auth/refresh')) {
        authService.clearTokens();
        window.location.href = '/login';
        return Promise.reject(handleError(error));
      }

      originalRequest._retry = true;
      try {
        const { access_token } = await authService.refreshToken();
        if (!access_token) {
          throw new Error('No access token received');
        }
        authService.setAccessToken(access_token);
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        authService.clearTokens();
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(handleError(error));
      }
    }

    // Handle rate limiting (429 Too Many Requests)
    if (axiosError.response?.status === 429) {
      const retryAfter = parseInt(axiosError.response.headers['retry-after'] || '60', 10);
      await sleep(retryAfter * 1000);
      return api(originalRequest);
    }

    // Retry on network errors or 5xx server errors
    if (
      (!axiosError.response || axiosError.response.status >= 500) &&
      !originalRequest._retryCount
    ) {
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      if (originalRequest._retryCount <= MAX_RETRIES) {
        await sleep(RETRY_DELAY * originalRequest._retryCount);
        return api(originalRequest);
      }
    }

    return Promise.reject(handleError(error));
  }
);

export default api;
export { ApiError };
