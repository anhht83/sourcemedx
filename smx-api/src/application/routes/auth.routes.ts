import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { validateDTO } from '../middlewares/validateDTO'
import {
  ForgotPasswordDTO,
  LoginDTO,
  RegisterDTO,
  ResetPasswordDTO,
} from '../dtos/auth.dto'
import { auth } from '../middlewares/auth'

export const authRouter = Router()
const controller = new AuthController()

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/RegisterDTO"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid request body
 */
authRouter.post('/register', validateDTO(RegisterDTO), controller.register)

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/LoginDTO"
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthResponse"
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AppError"
 */
authRouter.post('/login', validateDTO(LoginDTO), controller.login)

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh the access token
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthResponse"
 *       401:
 *         description: Invalid token
 */
authRouter.post('/refresh-token', controller.refreshToken)

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Send a password reset email to the user with the provided email address
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ForgotPasswordDTO"
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 */
authRouter.post(
  '/forgot-password',
  validateDTO(ForgotPasswordDTO),
  controller.forgotPassword,
)

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset the password for the user with the provided reset token
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ResetPasswordDTO"
 *     responses:
 *       200:
 *         description: Password reset successfully
 */
authRouter.post(
  '/reset-password',
  validateDTO(ResetPasswordDTO),
  controller.resetPassword,
)

/**
 * @swagger
 * /api/auth/validate-token:
 *   get:
 *     summary: Validate the access token
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Access token is valid
 *       401:
 *         description: Invalid token
 */
authRouter.get('/validate-token', auth, (req, res) => {
  res.json(true)
})

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout the user
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
authRouter.post('/logout', controller.logout)
