import { Request, Response } from 'express'

export class AuthHelper {
  /*
  static setAuthRefreshToken(refreshToken: string, res: Response): void {
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // Prevents JavaScript access (protects against XSS attacks)
      secure: process.env.NODE_ENV === "production", // Use secure cookies only in production
      sameSite: "strict", // Prevents CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }
  */
  static getAuthRefreshToken(req: Request) {
    return req.cookies['refreshToken'] || req.body?.refreshToken
  }

  static removeAuthRefreshToken(res: Response) {
    res.clearCookie('refreshToken')
    res.clearCookie('accessToken')
  }
}
