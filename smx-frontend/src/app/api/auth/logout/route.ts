import { NextResponse } from 'next/server'
import { loggedOut } from '@/lib/auth'
import { apiFetch } from '@/lib/fetch'
import { IAppErrorResponse } from '@/lib/AppError'

export async function POST() {
  try {
    const res: any = await apiFetch('/auth/logout', {
      method: 'POST',
      useAuth: false,
    })
    await loggedOut()
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
