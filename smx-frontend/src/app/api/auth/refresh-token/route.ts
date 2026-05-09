import { NextResponse } from 'next/server'
import { IAppErrorResponse } from '@/lib/AppError'
import { getRefreshToken, setAccessToken } from '@/lib/auth'
import { apiFetch } from '@/lib/fetch'

export async function POST() {
  const refreshToken = await getRefreshToken()
  if (!refreshToken)
    return NextResponse.json(
      { message: 'No refresh token found.' } as IAppErrorResponse,
      { status: 401 },
    )

  try {
    const res: any = await apiFetch('/auth/refresh-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    const { accessToken } = res
    await setAccessToken(accessToken)

    return NextResponse.json(res)
  } catch (error: any) {
    return NextResponse.json(
      {
        statusCode: error.response.statusCode,
        message: error.response.message,
        errors: error.response.errors,
      } as IAppErrorResponse,
      { status: error.status || 500 },
    )
  }
}
