import { AppError, IAppErrorResponse } from '@/lib/AppError'
import { getAccessToken } from '@/lib/auth'

type TBody = Record<string, any> | FormData | URLSearchParams | undefined | null

interface IRequest extends Omit<RequestInit, 'body'> {
  params?: Record<string, any>
  useAuth?: boolean
  useExternalApi?: boolean
  body?: TBody
}

export async function apiFetch<T>(
  endpoint: string,
  {
    params = {},
    useAuth = true,
    useExternalApi = true,
    body,
    headers,
    ...options
  }: IRequest = {},
): Promise<T> {
  try {
    const API_BASE_URL = useExternalApi
      ? process.env.NEXT_PUBLIC_EXTERNAL_API_URL!
      : process.env.NEXT_PUBLIC_INTERNAL_API_URL!

    const accessToken = await getAccessToken()
    const requestOptions: IRequest = {
      ...options,
      credentials: 'include', // Send cookies (accessToken/refreshToken) from client side
    }

    const requestHeaders = new Headers(headers)
    let requestBody: BodyInit | null = null
    // set access token in headers
    await setHeaderAuth(requestHeaders, accessToken)

    let url = `${API_BASE_URL}${endpoint}`
    const queryString = new URLSearchParams(params).toString()
    if (queryString) {
      url += `?${queryString}`
    }

    if (
      body &&
      !(body instanceof FormData || body instanceof URLSearchParams)
    ) {
      requestHeaders.set('Content-Type', 'application/json')
      requestBody = JSON.stringify(body)
    }

    let response = await fetch(url, {
      ...requestOptions,
      headers: requestHeaders,
      body: requestBody,
    })

    // Handle access token refresh if expired
    if (response.status === 401 && useAuth) {
      console.warn('Access token expired, attempting refresh...')
      const refreshResponse = await fetch(
        `${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/auth/refresh-token`,
        {
          method: 'POST',
          headers: requestHeaders,
          credentials: 'include',
        },
      )
      if (refreshResponse.ok) {
        // get new access token
        const newAccessToken = (await refreshResponse.json())
          .accessToken as string
        // update headers with new access token
        await setHeaderAuth(requestHeaders, newAccessToken)
        // Retry original request after refreshing token
        response = await fetch(url, {
          ...requestOptions,
          headers: requestHeaders,
          body: requestBody,
        })
      } else {
        throw new AppError('Token refresh failed. Please log in again.')
      }
    }

    // Handle non-200 responses
    if (!response.ok) {
      const errorResponse = await parseError(response)
      throw new AppError(errorResponse, response.status)
    }

    return (await response.json()) as T
  } catch (error: any) {
    if (error instanceof AppError) throw error
    throw new AppError(
      { message: error.message || 'An unknown error occurred' },
      500,
    )
  }
}

/**
 * Parses the error response body
 */
async function parseError(response: Response): Promise<IAppErrorResponse> {
  try {
    return await response.json()
  } catch {
    return {
      message: `HTTP Error: ${response.status}`,
      statusCode: response.status,
    }
  }
}

// set cookies (accessToken/refreshToken from client side) and Authorization header with access token
async function setHeaderAuth(
  requestHeaders: Headers,
  accessToken?: string,
): Promise<void> {
  // set new access token in cookies on server side to use HTTPOnly cookie
  if (typeof window === 'undefined') {
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    const cookieHeader = cookieStore
      .getAll()
      .map((cookie) => {
        // replace new access token in cookies
        if (cookie.name === 'accessToken' && accessToken) {
          cookie.value = accessToken
        }
        return `${cookie.name}=${cookie.value}`
      })
      .join('; ')
    requestHeaders.set('Cookie', cookieHeader)
  }
  // set new access token in Authorization header to request to external API
  requestHeaders.set('Authorization', `Bearer ${accessToken}`)
}
