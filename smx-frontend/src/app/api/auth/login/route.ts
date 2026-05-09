import { NextResponse } from 'next/server'
import { ILoginRequest } from '@/types/user'
import { loggedIn } from '@/lib/auth'
import { apiFetch } from '@/lib/fetch'
import { IAppErrorResponse } from '@/lib/AppError'

export async function POST(req: Request) {
  try {
    const { email, password }: ILoginRequest = await req.json()
    const res: any = await apiFetch('/auth/login', {
      method: 'POST',
      body: { email, password },
      useAuth: false,
    })
    await loggedIn(res)
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
