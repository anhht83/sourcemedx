import { userRepository } from '../repositories/user.repository'
import { CreateUserDTO } from '../dtos/user.dto'
import { AuthService } from '../services/auth.service'
import { IAuthResponse } from '../interfaces/auth.interface'
import { AuthPresenter } from '../presenters/auth.presenter'
import { LoginDTO } from '../dtos/auth.dto'
import { AppError } from '../../utils/AppError'
import { StatusCodes } from 'http-status-codes'
import { tokenRepository } from '../repositories/token.repository'
import { TokenService } from '../services/token.service'
import { ETokenType } from '../enums/token.enum'
import { EmailService } from '../services/email.service'
import { config } from '../../configs/config'
import { IUser } from '../interfaces/user.interface'
import { SearchKeysService } from '../services/search-keys.service'

export class AuthUseCase {
  searchKeysService: SearchKeysService
  constructor() {
    this.searchKeysService = new SearchKeysService()
  }

  async register(dto: CreateUserDTO): Promise<any> {
    const existingUser = await userRepository.findByEmail(dto.email)
    if (existingUser) {
      throw new AppError(
        {
          message: 'Email already exists',
          errors: {
            invalidFields: {
              email: '',
            },
          },
        },
        StatusCodes.BAD_REQUEST,
      )
    }

    const hashedPassword = await AuthService.hashPassword(dto.password)
    // store new user
    const newUser = await userRepository.createAndSave({
      email: dto.email,
      password: hashedPassword,
      firstName: dto.firstName,
      lastName: dto.lastName,
      company: dto.company,
      isActive: false,
    } as IUser)

    await this.searchKeysService.rewardRegister(newUser.id)
    return true
    // auto login
    /*
    return await this.loginByEmail({
      email: dto.email,
      password: dto.password,
    })
    */
  }

  async loginByEmail(credential: LoginDTO): Promise<IAuthResponse> {
    const user = await userRepository.findByEmail(credential.email)
    if (!user) {
      throw new AppError('Invalid credentials', StatusCodes.UNAUTHORIZED)
    }

    const isValidPassword = await AuthService.comparePassword(
      credential.password,
      user.password,
    )
    if (!isValidPassword) {
      throw new AppError('Invalid credentials', StatusCodes.UNAUTHORIZED)
    }
    if (!user.isActive) {
      throw new AppError(
        `Thanks for your interest! SourceMedX is currently in private early access. We'll notify you once we're ready to launch publicly. <a class="underline" href="${config.landingUrl}/#join_us">Join our waitlist here</a>.​`,
        StatusCodes.FORBIDDEN,
      )
    }
    const refreshToken = AuthService.generateRefreshToken(user.id)
    const accessToken = AuthService.generateToken(user.id)
    // Store refreshToken in HTTP-only cookie
    // AuthHelper.setAuthRefreshToken(refreshToken, res)

    return AuthPresenter.userWithTokenToView(
      { accessToken, refreshToken },
      user,
    )
  }

  async refreshToken(token: string): Promise<string> {
    if (!token) {
      throw new AppError('Unauthorized', StatusCodes.UNAUTHORIZED)
    }

    const decoded = AuthService.verifyRefreshToken(token)
    // Generate new ac
    return AuthService.generateToken(decoded.userId)
  }

  async forgotPassword(email: string): Promise<void> {
    // check if user exist
    const user = await userRepository.findByEmail(email)
    if (!user) {
      throw new AppError(
        {
          message: "Email doesn't exist",
          errors: {
            invalidFields: {
              email: true,
            },
          },
        },
        StatusCodes.BAD_REQUEST,
      )
    }
    // delete all previous reset password tokens
    await tokenRepository.delete({
      userId: user.id,
      tokenType: ETokenType.RESET_PASSWORD,
    })
    // generate new reset password token
    const resetToken = await TokenService.generateToken(
      user.id,
      ETokenType.RESET_PASSWORD,
    )
    // send email
    const emailService = new EmailService()
    await emailService.sendTemplateEmail({
      to: user.email,
      subject: 'Reset password',
      templateId: emailService.emailConfig.templates.resetPassword as string,
      variables: {
        user,
        resetLink: `${config.frontendUrl}/auth/reset-password?token=${resetToken}`,
      },
    })
  }

  async resetPassword(token: string, newPassword: string) {
    //valid token before updating
    const resetToken = await TokenService.validateToken(token)
    // update new password
    const hashedPassword = await AuthService.hashPassword(newPassword)
    await userRepository.update(
      { id: resetToken.userId },
      { password: hashedPassword },
    )
    // Delete used token
    await tokenRepository.delete({ id: resetToken.id })
  }

  async validateAccessToken(token: string) {
    return AuthService.verifyAccessToken(token)
  }
}
