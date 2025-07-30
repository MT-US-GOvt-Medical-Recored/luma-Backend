import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/app/auth/entities/user.entity";
import { HashService } from "src/shared/services";
import { OAuth2Client } from "google-auth-library";
import { Repository } from "typeorm";
import {
  LoginDto,
  RegisterDto,
  LoginViaGoogleRequestDto,
} from "../dtos";
import { IAuthenticatedUserPayload } from "../types/auth.types";
import { AuthHelperService } from "./auth-helper.service";
import { AuthTokenService } from "./auth-token.service";
import { SessionService } from "./session.service";
import { ConfigService } from "src/config";

@Injectable()
export class AuthService {
  private readonly googleClient: OAuth2Client;
  constructor(
    @InjectRepository(User)
    protected readonly userRepository: Repository<User>,
    private readonly hashService: HashService,
    private readonly sessionService: SessionService,
    private readonly authHelperService: AuthHelperService,
    private readonly authTokenService: AuthTokenService,
    private readonly configService: ConfigService,
  ) {
    this.googleClient = new OAuth2Client(
      this.configService.getGoogleAuthClientId(),
      this.configService.getGoogleAuthClientSecret()
    );
  }

  async login(body: LoginDto) {
    // Find user by email
    const eitherUserOrNull = await this.userRepository.findOne({
      select: {
        id: true,
        fullName: true,
        email: true,
        password: true,
      },
      where: {
        email: body.email,
      },
    });

    // If user is not found or password is invalid
    if (
      !eitherUserOrNull ||
      !(await this.authHelperService.isPasswordValid(
        body.password,
        eitherUserOrNull.password
      ))
    ) {
      throw new UnauthorizedException("Either email or password is invalid.");
    }

    // Save a new session
    const session = await this.sessionService.create({
      user: eitherUserOrNull,
      isAuthenticated: true,
    });

    // Jwt Payload
    const jwtPayload: IAuthenticatedUserPayload = {
      userId: eitherUserOrNull.id,
      sessionId: session.id,
    };

    // Generate access token
    const accessToken = this.authTokenService.sign(jwtPayload);

    // Return access token and required detials of the currently loggedin user
    const { password, ...userWithoutPassword } = eitherUserOrNull;
    return {
      message: `Loggedin successfully.`,
      accessToken,
      user: userWithoutPassword,
    };
  }
  async register(body: RegisterDto) {
    //  duplication validation
    const duplicateUsersCount =
      await this.userRepository.count({ where: { email: body.email } });

    if (duplicateUsersCount > 0) {
      throw new BadRequestException("User with this email already exists.");
    }
    const hashedPassword = await this.hashService.hashPassword(body.password);
    // create a new user
    const newUser = await this.userRepository.save(
      {
        fullName: body.fullName,
        email: body.email,
        password: hashedPassword,
      }
    );


    await this.authHelperService.sendAccountRegistrationEmail(newUser);

    return { user_id: newUser.id, message: `Your account has been registered successfully` }
  }
  async logout(user: IAuthenticatedUserPayload) {
    await this.sessionService.deleteSession(user.sessionId);
  }
  // Validate Social Auth Token For Google
  private async validateGoogleTokenAndGetPayload(token: string) {
    try {
      // verify the user token
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: this.configService.getGoogleAuthClientId(),
      });

      // return the verified user payload
      return ticket.getPayload();
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
  // login via google
  async loginViaGoogle(body: LoginViaGoogleRequestDto) {

    // validate google token
    const { email, name: fullName } = await this.validateGoogleTokenAndGetPayload(body.token);

    // Check if user already exists with Google registration source
    let findUserOrUpdate = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    // If user doesn't exist, check for duplicate and create a new one
    if (!findUserOrUpdate) {
      const duplicateUsersCount = await this.userRepository.count({ where: { email } });

      if (duplicateUsersCount > 0) {
        throw new ConflictException("A user with this email already exists.");
      }
      const hashedPassword = await this.hashService.hashPassword("google");
      const newUser = await this.userRepository.save(
        {
          fullName,
          email,
          googleId: body.token,
          password: hashedPassword,
        }
      );
      findUserOrUpdate = newUser;

      // Save user and send welcome email
      await this.authHelperService.sendAccountRegistrationEmail(newUser);
    }
    // Save a new session
    const session = await this.sessionService.create({
      user: findUserOrUpdate,
      isAuthenticated: true,
    });

    // Jwt Payload
    const jwtPayload: IAuthenticatedUserPayload = {
      userId: findUserOrUpdate.id,
      sessionId: session.id,
    };

    // Generate access token
    const accessToken = this.authTokenService.sign(jwtPayload);

    // Return access token and required detials of the currently loggedin user
    const { password, ...userWithoutPassword } = findUserOrUpdate;
    return {
      message: `Loggedin successfully.`,
      accessToken,
      user: userWithoutPassword,
    };
  }

}
