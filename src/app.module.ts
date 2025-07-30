import { Module } from "@nestjs/common";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { ConfigModule } from "./config/config.module";
import { SharedModule } from "./shared/shared.module";
import { ConfigService } from "./config";
import { LoggingInterceptor } from "./shared/interceptors/logging-interceptor";
import { WinstonModule } from "nest-winston";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ScheduleModule } from "@nestjs/schedule";
import { DatabaseModule } from "./database/database.module";
import { AuthenticationGuard } from "./app/auth/guards/authentication.guard";
import { AuthModule } from "./app/auth/auth.module";
import { AuthorizationGuard } from "./app/auth/guards/authorization.guard";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule,
    SharedModule,
    DatabaseModule,
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.getWinstonOptions(),
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard,
    },
  ],
})
export class AppModule {}
