import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/app/auth/entities/user.entity";
import { HashService } from "src/shared/services";
import { Repository } from "typeorm";
import { 
  LoginDto, 
  RegisterDto,
  GoogleLoginDto,
} from "../dtos";
import { IAuthenticatedUserPayload } from "../types/auth.types";
import { AuthHelperService } from "./auth-helper.service";
import { AuthTokenService } from "./auth-token.service";
import { SessionService } from "./session.service";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    protected readonly userRepository: Repository<User>,
    private readonly hashService: HashService,
    private readonly sessionService: SessionService,
    private readonly authHelperService: AuthHelperService,
    private readonly authTokenService: AuthTokenService,
  ) { }

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

  async loginWithGoogle(googleLoginDto: GoogleLoginDto) {
    // Verify Google token (in a real app, you would verify the token with Google's API)
    // For now, we'll trust the token is already verified by the client
    
    // Check if user exists by Google ID or email
    let user = await this.userRepository.findOne({
      where: [
        { email: googleLoginDto.email }
      ]
    });

    // If user doesn't exist, create a new user
    if (!user) {
      user = this.userRepository.create({
        fullName: googleLoginDto.fullName,
        email: googleLoginDto.email,
        googleId: googleLoginDto.googleId,
        // Generate a random password since it's required
        // The user can set a password later if needed
        password: await this.hashService.hashPassword(Math.random().toString(36).slice(-8)),
        isEmailVerified: true // Since we trust Google's verification
      });
      
      await this.userRepository.save(user);
    }

    // Create a session for the user
    const session = await this.sessionService.create({
      user,
      isAuthenticated: true,
    });

    // Generate JWT token
    const payload: IAuthenticatedUserPayload = {
      userId: user.id,
      sessionId: session.id,
    };

    const token = this.authTokenService.sign(payload);

    return {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      },
      token,
    };
  }

}
