import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { AuthController } from "./controllers/auth.controller";
import { PassportModule } from "@nestjs/passport";
import { ConfigService } from "../../config/config.service";
import { ConfigModule } from "../../config/config.module";
import {
  AuthService,
  AuthHelperService,
  AuthTokenService,
  SessionService,
} from "./services";
import { SharedModule } from "src/shared/shared.module";
import { Session } from "./entities/session.entity";
import { User } from "./entities/user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Session, User]),
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getJWTSecretKey(),
        signOptions: {
          expiresIn: configService.getJWTTokenExpiration(),
        },
      }),
    }),
    ConfigModule,
    SharedModule,
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    AuthService,
    AuthTokenService,
    SessionService,
    AuthHelperService,
  ],
  exports: [
    AuthService,
    AuthTokenService,
    SessionService,
    AuthHelperService,
    TypeOrmModule,
  ],
})
export class AuthModule {}
