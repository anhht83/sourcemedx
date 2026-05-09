import { Request, Response, NextFunction } from 'express'
import getRawBody from 'raw-body'

export function stripeRawBodyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  getRawBody(
    req,
    {
      length: req.headers['content-length'],
      limit: '1mb',
      encoding: 'utf-8',
    },
    (err, string) => {
      if (err) {
        console.error('❌ Raw body error:', err)
        return next(err)
      }
      ;(req as any).rawBody = string
      next()
    },
  )
}
