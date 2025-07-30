import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "src/config";
import * as nodemailer from 'nodemailer';

type SendEmailRequiredParams = {
  to: string;
  text?: string;
  subject: string;
  html?: string;
};

export type SendEmailParams = SendEmailRequiredParams

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.getMailtrapHost(),
      port: this.configService.getMailtrapPort(),
      auth: {
        user: this.configService.getMailtrapUser(),
        pass: this.configService.getMailtrapPass(),
      },
    });
  }

  async sendEmail(payload: SendEmailParams) {
    try {
      const { to, subject, text, html } = payload
      const fromEmail = this.configService.getEmailToSendEmailsFrom();
      const mailOptions: nodemailer.SendMailOptions = {
        from: fromEmail,
        to,
        subject,
        html,
        ...(text && { text }), // Include 'text' only if it is provided
      };
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (e) {
      console.log(e);

      throw new BadRequestException(
        "Failed to send email. Please contact administrator."
      );
    }
  }
}
