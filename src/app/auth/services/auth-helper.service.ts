import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { EmailService, HashService } from "src/shared/services";
import { ChangePasswordDto } from "../dtos";
import { ConfigService } from "src/config";
import { User } from "src/app/auth/entities/user.entity";
import { SessionService } from "./session.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class AuthHelperService {
  constructor(
    private readonly hashService: HashService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly sessionService: SessionService,
    private readonly emailService: EmailService
  ) { }

  async isPasswordValid(plainPassword: string, hashedPassword: string) {
    return await this.hashService.check(plainPassword, hashedPassword);
  }

  async validateIfUserCanChangePassword(user: User, dto: ChangePasswordDto) {
    const isCurrentPasswordValid = await this.isPasswordValid(
      dto.currentPassword,
      user.password
    );

    if (!isCurrentPasswordValid) {
      throw new BadRequestException(
        "Current password is invalid. Please try again."
      );
    }

    if (dto.currentPassword === dto.newPassword) {
      throw new BadRequestException(
        "The new password must be different from the current password."
      );
    }

    return;
  }

  async validateUser(userId: string) {
    // find user by id
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    // If user is not found, throw an unauthorized exception
    if (!user) {
      throw new UnauthorizedException(
        "The provided token belongs to a user that no longer exists in our system."
      );
    }

    // return user
    return user;
  }

  async validateSession(user: User, tokenSessionId: string) {
    // Find the session whose id matches the sessionId we got in the payload
    const session = await this.sessionService.findOne({
      where: {
        id: tokenSessionId,
        user: {
          id: user.id,
        },
      },
    });

    // If session is not found, throw an unauthorized exception
    if (!session) {
      throw new UnauthorizedException(
        "Session has been expired. Please login again."
      );
    }

    // return session
    return session;
  }

  async sendPasswordResetEmail(
    user: User,
    token: string,
    minutes?: number | string
  ) {
    const frontendUrl = this.configService.getFrontendUrl();
    const resetLink = `${frontendUrl}/set-new-password?token=${token}`;

    // Email subject
    const emailSubject = "Password Reset Request for Your Account.";

    // Email content
    const emailText = `Click the following link to reset your password.`;
    const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6;">
          <p>Dear ${user.fullName},</p>
          <p>Click the link below to reset your password:</p>
          <p>
            <a href="${resetLink}" target="_blank" style="background-color: #000; color: #fff; padding: 10px 15px; text-decoration: none; border-radius: 5px;">
              Reset My Password
            </a>
          </p>
          <p><strong>Important:</strong> For security reasons, this reset link will expire in ${minutes} minutes.</p>
        </body>
      </html>
  `;

    return this.emailService.sendEmail({
      subject: emailSubject,
      text: emailText,
      html: htmlContent,
      to: user.email,
    });
  }
  async sendAccountRegistrationEmail(
    user: User
  ) {
    // Email subject
    const emailSubject = "Account Registered Successfully.";

    // Email content
    const emailText = `Account has been registered successfully.`;
    const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6;">
          <p>Dear ${user.fullName},</p>
          <p>Your account has been registered successfully.</p>
          <p><strong>Important:</strong> Keep your account credentials safe and donot share with anyone else.</p>
        </body>
      </html>
  `;

    return this.emailService.sendEmail({
      subject: emailSubject,
      text: emailText,
      html: htmlContent,
      to: user.email,
    });
  }
}
