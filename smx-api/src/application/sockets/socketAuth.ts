import { Socket } from 'socket.io'
import { User } from '../entities'
import jwt from 'jsonwebtoken'
import { config } from '../../configs/config'
import { AppError } from '../../utils/AppError'

const JWT_SECRET = config.jwt.accessSecret

export const socketAuth = (socket: Socket & { user?: User }, next: any) => {
  try {
    const cookies = socket.handshake.headers.cookie
    // Parse Cookies Manually
    const parsedCookies = Object.fromEntries(
      cookies?.split('; ').map((c) => c.split('=')) || [],
    )

    const accessToken = parsedCookies.accessToken as string
    if (!accessToken) {
      console.log('No token provided.')
      return next(new AppError('Authentication error'))
    }

    // Verify JWT Token
    jwt.verify(accessToken, JWT_SECRET, (err, decoded: any) => {
      if (err) {
        return next(new AppError('Authentication error'))
      }
      const user = new User()
      user.id = decoded.userId
      socket.user = user // Attach user data to socket
      next()
    })
  } catch (error: any) {
    next(new AppError(error?.message || 'Authentication error'))
  }
}
