import { subscriberRepository } from '../repositories/subscriber.repository'
import { AppError } from '../../utils/AppError'
import { StatusCodes } from 'http-status-codes'
import { EmailService } from '../services/email.service'

export class SubscriberUseCase {
  constructor() {}

  subscribe = async (email: string): Promise<string> => {
    try {
      const existing = await subscriberRepository.findOneBy({ email })
      if (existing) {
        if (!existing.isActive) {
          existing.isActive = true
          await subscriberRepository.save(existing)
          return 'Subscription re-activated.'
        }
        return 'You are already subscribed'
      }
      const newSub = subscriberRepository.create({ email })
      await subscriberRepository.save(newSub)
      // send email
      const emailService = new EmailService()
      await emailService.sendTemplateEmail({
        to: email,
        subject: 'Join the Future of Medical Device Sourcing',
        templateId: emailService.emailConfig.templates
          .newsletterSignup as string,
      })
      return 'Successfully subscribed!'
    } catch (error: any) {
      throw new AppError(
        error?.message || 'Failed to subscribe',
        StatusCodes.BAD_REQUEST,
      )
    }
  }
}
