import { AppError } from '../../utils/AppError'
import sgMail from '../../configs/sendGrid'
import {
  IEmail,
  IEmailConfig,
  ISendEmail,
  ISendTemplateEmail,
} from '../interfaces/email.interface'
import { config } from '../../configs/config'

export class SendGridService implements IEmail {
  emailConfig: IEmailConfig

  constructor() {
    this.emailConfig = config.sendGrid
  }

  /**
   * ✅ Send a plain text email
   */
  async sendEmail({
    to,
    subject,
    text = '',
    html = '',
  }: ISendEmail): Promise<void> {
    const msg = {
      to,
      from: config.sendGrid.senderEmail,
      subject,
      text,
      html,
    }

    try {
      await sgMail.send(msg)
    } catch (error: any) {
      throw new AppError(`Failed to send email: ${error.message}`)
    }
  }

  /**
   * ✉️ Send an email using a SendGrid dynamic template
   */

  async sendTemplateEmail({
    to,
    subject,
    templateId,
    variables,
  }: ISendTemplateEmail): Promise<void> {
    const msg = {
      to,
      from: config.sendGrid.senderEmail,
      subject,
      templateId,
      dynamicTemplateData: variables || {},
    }

    try {
      await sgMail.send(msg)
    } catch (error: any) {
      throw new AppError(`Failed to send template email: ${error.message}`)
    }
  }
}
