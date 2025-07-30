import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { IAuthenticatedUserPayload } from "../types/auth.types";
import { ConfigService } from "../../../config/config.service";
import { AuthHelperService } from "../services";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    private readonly configService: ConfigService,
    private readonly authHelperService: AuthHelperService
  ) {
    super({
      passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getJWTSecretKey(),
    });
  }

  async validate(req: Request, payload: IAuthenticatedUserPayload) {
    // find user by userId and get all sessions associated with the account
    const { userId, sessionId } = payload;

    // if token of some other type was provided
    if (!userId || !sessionId) throw new UnauthorizedException();

    // validate user
    const user = await this.authHelperService.validateUser(userId);

    // validate session
    const session = await this.authHelperService.validateSession(
      user,
      sessionId
    );

    // pass data to next middleware
    return {
      ...user,
      session,
    };
  }
}
