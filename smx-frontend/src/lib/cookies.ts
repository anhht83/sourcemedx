'use server'

export async function getCookieStore() {
  const { cookies } = await import('next/headers')
  return cookies()
}

export async function getCookie(key: string) {
  const cookieStore = await getCookieStore()
  return cookieStore.get(key)?.value
}

export async function setCookie(key: string, value: any, options: any = {}) {
  const isProduction = process.env.NODE_ENV === 'production'
  const cookieStore = await getCookieStore()
  cookieStore.set(key, value, {
    domain: isProduction ? '.sourcemedx.com' : undefined,
    httpOnly: true,
    path: '/',
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    ...options,
  })
}

export async function removeCookie(key: string) {
  await setCookie(key, '', { maxAge: 0 })
}
