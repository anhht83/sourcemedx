import { apiFetch } from '@/lib/fetch'
import {
  ILoginRequest,
  ILoginResponse,
  IRegisterRequest,
  IResetPasswordRequest,
} from '@/types/user'

export async function registerService(
  values: IRegisterRequest,
): Promise<ILoginResponse> {
  try {
    return await apiFetch<ILoginResponse>('/auth/register', {
      method: 'POST',
      body: values,
      useAuth: false,
    })
  } catch (error) {
    throw error
  }
}

export async function loginService(credentials: ILoginRequest): Promise<void> {
  try {
    return await apiFetch<void>('/auth/login', {
      method: 'POST',
      body: credentials,
      useExternalApi: false,
      useAuth: false,
    })
  } catch (error) {
    throw error
  }
}

export async function logoutService(): Promise<void> {
  try {
    return await apiFetch<void>('/auth/logout', {
      method: 'POST',
      useExternalApi: false,
      useAuth: false,
    })
  } catch (error) {
    throw error
  }
}

export async function forgotPasswordService(email: string) {
  try {
    return await apiFetch<void>('/auth/forgot-password', {
      method: 'POST',
      body: { email },
      useAuth: false,
    })
  } catch (error) {
    throw error
  }
}

export async function resetPasswordService(values: IResetPasswordRequest) {
  try {
    return await apiFetch<ILoginResponse>('/auth/reset-password', {
      method: 'POST',
      body: values,
      useAuth: false,
    })
  } catch (error) {
    throw error
  }
}

export async function validateTokenService() {
  try {
    return await apiFetch<boolean>('/auth/validate-token', {
      useAuth: true,
    })
  } catch (error) {
    throw error
  }
}

export async function refreshTokenService() {
  try {
    return await apiFetch<{ accessToken: string }>('/auth/refresh-token', {
      method: 'POST',
      useAuth: false,
      useExternalApi: false,
    })
  } catch (error) {
    throw error
  }
}
