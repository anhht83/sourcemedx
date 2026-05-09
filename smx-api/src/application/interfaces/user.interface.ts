export interface IUser {
  id: string
  email: string
  password: string
  firstName: string
  lastName: string
  company: string
  createdAt?: Date
  updatedAt?: Date
  isActive?: boolean
}

export type TUserResponse = Omit<IUser, 'password'>
