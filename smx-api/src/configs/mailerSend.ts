import { MailerSend, Sender } from 'mailersend'
import { config } from './config'

export const mailerSend = new MailerSend({
  apiKey: config.mailerSend.apiKey || '',
})
export const sender = new Sender(config.mailerSend.senderEmail, 'SourceMedX')
