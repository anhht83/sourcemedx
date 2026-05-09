import { Request, Response, NextFunction } from 'express'
import { AppError } from '../../utils/AppError'
import { ThreadUseCase } from '../usecases/thread.usecase'
import { User } from '../entities/user.entity'

export class ThreadController {
  threadUseCase: ThreadUseCase

  constructor() {
    this.threadUseCase = new ThreadUseCase()
  }

  fetchThreads = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user
      if (!user) {
        throw new AppError('User not found')
      }
      const data = await this.threadUseCase.fetchThreads(user as User)
      res.json(data)
    } catch (error) {
      next(error)
    }
  }

  getThread = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.threadUseCase.getThread(req.params.id)
      res.json(data)
    } catch (error) {
      next(error)
    }
  }

  generateReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user
      if (!user) {
        throw new AppError('User not found')
      }
      await this.threadUseCase.generateReport(req.params.id, user.id)
      res.json(true)
    } catch (error) {
      next(error)
    }
  }
}
