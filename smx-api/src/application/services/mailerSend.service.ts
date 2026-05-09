import { AppError } from '../../utils/AppError'
import {
  IEmail,
  IEmailConfig,
  ISendEmail,
  ISendTemplateEmail,
} from '../interfaces/email.interface'
import { EmailParams, Recipient } from 'mailersend'
import { mailerSend, sender } from '../../configs/mailerSend'
import { config } from '../../configs/config'

export class MailerSendService implements IEmail {
  public emailConfig: IEmailConfig

  constructor() {
    this.emailConfig = config.mailerSend
  }

  async sendEmail({
    to,
    subject,
    text = '',
    html = '',
  }: ISendEmail): Promise<void> {
    const recipients = [new Recipient(to)]

    const emailParams = new EmailParams()
      .setFrom(sender)
      .setTo(recipients)
      .setSubject(subject)
      .setText(text)
      .setHtml(html)
    try {
      await mailerSend.email.send(emailParams)
    } catch (error: any) {
      throw new AppError(`Failed to send email: ${error.message}`)
    }
  }

  /**
   * ✉️ Send an email using a dynamic template
   */

  async sendTemplateEmail({
    to,
    subject,
    templateId,
    variables,
  }: ISendTemplateEmail): Promise<void> {
    const recipients = [new Recipient(to)]
    const emailParams = new EmailParams()
      .setFrom(sender)
      .setSubject(subject)
      .setTo(recipients)
      .setTemplateId(templateId)
    if (variables) {
      emailParams.setPersonalization([
        {
          email: to,
          data: variables, // ✅ Key-value pairs matching MailerSend template variables
        },
      ])
    }

    try {
      await mailerSend.email.send(emailParams)
    } catch (error: any) {
      throw new AppError(
        `Failed to send template email: ${error?.body?.message || error.message || ''}`,
      )
    }
  }
}
