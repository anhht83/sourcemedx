// 🔹 User Role Enum (Optional)
export enum IUserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
}

// 🔹 User Type Definition
export interface IUser {
  id: string
  firstName?: string
  lastName?: string
  name?: string
  email: string
  avatarUrl?: string // Optional field
  role: IUserRole
  createdAt: string // ISO string format
  updatedAt: string
}

// 🔹 Login Request Type
export interface ILoginRequest {
  email: string
  password: string
}

// 🔹 Login Response Type
export interface ILoginResponse extends IUser {
  accessToken: string // JWT token
  refreshToken?: string // Optional field
}

// 🔹 Register Request Type
export interface IRegisterRequest {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  company: string
}

export interface IForgotPasswordRequest {
  email: string
}

export interface IResetPasswordRequest {
  token: string
  newPassword: string
}
