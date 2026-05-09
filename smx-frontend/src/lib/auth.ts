'use server'

import * as authService from '@/services/authService'
import { getCookie, removeCookie, setCookie } from '@/lib/cookies'
import { ILoginResponse, IUser } from '@/types/user'

export async function getAccessToken(): Promise<string | undefined> {
  return await getCookie('accessToken')
}

export async function setAccessToken(token: string) {
  await setCookie('accessToken', token, {
    maxAge: 60 * 60 * 24, // 1 day
  })
}

export async function getRefreshToken(): Promise<string | undefined> {
  return await getCookie('refreshToken')
}

export async function setRefreshToken(token: string) {
  await setCookie('refreshToken', token, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function removeTokens() {
  await removeCookie('accessToken')
  await removeCookie('refreshToken')
}

export async function loggedIn({
  accessToken,
  refreshToken,
  ...user
}: ILoginResponse) {
  await setCookie(
    'currentUser',
    JSON.stringify({
      ...user,
      name: [user.firstName, user.lastName].join(' '),
    }),
    {
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  )
  await setAccessToken(accessToken)
  await setRefreshToken(refreshToken || '')
}

export async function loggedOut() {
  await removeCookie('currentUser')
  await removeTokens()
}

// get current user data from the server
export async function getCurrentUser(): Promise<IUser> {
  const user = await getCookie('currentUser')
  if (!user) return {} as IUser
  return JSON.parse(decodeURIComponent(user || '{}')) as IUser
}

export async function validateToken(token?: string): Promise<any> {
  if (!token) return null
  try {
    // Only decode the payload, do not verify signature (Edge Runtime limitation)
    const [, payloadBase64] = token.split('.')
    if (!payloadBase64) return null
    const payloadJson = atob(
      payloadBase64.replace(/-/g, '+').replace(/_/g, '/'),
    )
    const payload = JSON.parse(payloadJson)
    // Optionally, add your own expiration check here
    return payload
  } catch (error) {
    console.error('Invalid token:', error)
    return null
  }
  /*
  try {
    return await authService.validateTokenService()
  } catch (error: any) {
    console.log(error.message)
    return false
  }
   */
}

export async function refreshAccessToken() {
  try {
    const refreshed = await authService.refreshTokenService()
    await setAccessToken(refreshed.accessToken)
    return refreshed
  } catch (error: any) {
    console.log(error.message)
    await removeTokens()
    return null
  }
}
