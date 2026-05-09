import {
  IEmail,
  IEmailConfig,
  ISendEmail,
  ISendTemplateEmail,
} from '../interfaces/email.interface'
import { config } from '../../configs/config'
import { MailerSendService } from './mailerSend.service'
import { SendGridService } from './sendGrid.service'

export class EmailService implements IEmail {
  emailProvider: IEmail

  emailConfig: IEmailConfig

  constructor() {
    switch (config.emailProvider) {
      case 'mailerSend': {
        this.emailProvider = new MailerSendService()
        break
      }
      case 'sendGrid': {
        this.emailProvider = new SendGridService()
        break
      }
    }
    this.emailConfig = this.emailProvider.emailConfig
  }

  async sendEmail(email: ISendEmail): Promise<void> {
    return this.emailProvider.sendEmail(email)
  }

  async sendTemplateEmail(email: ISendTemplateEmail): Promise<void> {
    return this.emailProvider.sendTemplateEmail(email)
  }
}
