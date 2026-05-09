export interface ISendEmail {
  to: string
  subject: string
  text?: string
  html?: string
}

export interface ISendTemplateEmail {
  to: string
  subject: string
  templateId: string
  variables?: Record<string, any>
}

export interface IEmailConfig {
  apiKey: string
  senderEmail: string
  templates: {
    resetPassword: string
    newsletterSignup: string
  }
}

export interface IEmail {
  emailConfig: IEmailConfig

  sendEmail(email: ISendEmail): Promise<void>

  sendTemplateEmail(email: ISendTemplateEmail): Promise<void>
}
