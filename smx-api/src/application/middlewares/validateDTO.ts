import { Request, Response, NextFunction, RequestHandler } from 'express'
import { validate } from 'class-validator'
import { plainToInstance, ClassConstructor } from 'class-transformer'
import { AppError } from '../../utils/AppError'
import { StatusCodes } from 'http-status-codes'

// Define a proper middleware function that follows Express' expected RequestHandler type
export const validateDTO = <T extends object>(
  DTOClass: ClassConstructor<T>,
): RequestHandler => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // Convert request body to DTO instance
      const dtoInstance = plainToInstance(DTOClass, {
        ...req.body,
        ...(req.params || {}),
        ...req.query,
      })

      // Validate DTO instance
      const errors = await validate(dtoInstance as object, {
        //whitelist: true,
        //forbidNonWhitelisted: true,
      })

      if (errors.length > 0) {
        const formattedErrors = errors.reduce((acc: any, err) => {
          acc[err.property] = Object.values(err.constraints || {})[0]
          return acc
        }, {})
        // Create an error object and pass it to the next middleware
        throw new AppError(
          {
            message: 'Validation failed',
            errors: { invalidFields: formattedErrors },
          },
          StatusCodes.BAD_REQUEST,
        )
      }

      next() // Proceed if validation passes
    } catch (err) {
      next(err) // Forward unexpected errors
    }
  }
}
