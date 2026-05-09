import { NextFunction, Request, Response } from 'express'
import { IAppErrorResponse } from '../../utils/AppError'
import { StatusCodes } from 'http-status-codes'

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
  const errorResponse: IAppErrorResponse = err.response
  res.status(statusCode).json(errorResponse)
}
