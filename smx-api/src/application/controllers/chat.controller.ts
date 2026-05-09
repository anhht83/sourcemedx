import { Request, Response, NextFunction } from 'express'
import { ChatUseCase } from '../usecases/chat.usecase'
import { AppError } from '../../utils/AppError'
import { OpenAIService } from '../services/openai.service'
import { User } from '../entities/user.entity'

export class ChatController {
  chatUseCase: ChatUseCase
  openAIService: OpenAIService

  constructor() {
    this.chatUseCase = new ChatUseCase()
    this.openAIService = new OpenAIService()
  }

  newMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user
      if (!user) {
        throw new AppError('User not found')
      }
      const data = await this.chatUseCase.newMessage(req.body, user as User)
      res.json(data)
    } catch (error) {
      next(error)
    }
  }

  getMessagesByThread = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data = await this.chatUseCase.getMessagesByThread(
        req.params.threadId,
      )
      res.json(data)
    } catch (error) {
      next(error)
    }
  }

  generateEmbedding = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data = await OpenAIService.generateEmbedding(req.body.text)
      res.json(data)
    } catch (error) {
      next(error)
    }
  }
}
