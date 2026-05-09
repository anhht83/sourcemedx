import { apiFetch } from '@/lib/fetch'
import { IUser } from '@/types/user'

// get current user
export async function me() {
  try {
    return await apiFetch<IUser>('/users/me', {
      useAuth: true,
    })
  } catch (error) {
    throw error
  }
}
