import { Injectable } from "@nestjs/common";
import { S3 } from "aws-sdk";
import * as dotenv from "dotenv";
import * as Joi from "joi";
import * as AppRootPath from "app-root-path";
import * as Winston from "winston";
import { DeploymentEnvironmentTypes } from "src/shared/enums/deployment-environment-types.enum";
import { IEnvSchema } from "./env-schema.interface";

@Injectable()
export class ConfigService {
  private readonly envConfig: IEnvSchema;

  constructor() {
    dotenv.config();
    this.envConfig = this.validateEnvSchema(process.env);
  }

  private getEnvSchema() {
    const schema = Joi.object<IEnvSchema>({
      BASE_URL: Joi.string().uri().required(),
      FRONTEND_URL: Joi.string().uri().required(),
      NODE_ENV: Joi.string()
        .valid(...Object.values(DeploymentEnvironmentTypes))
        .default(DeploymentEnvironmentTypes.Development),
      PORT: Joi.number().port().required(),
      DB_USERNAME: Joi.string().trim().min(1).required(),
      DB_PASSWORD: Joi.string().trim().min(1).required(),
      DB_NAME: Joi.string().trim().min(1).required(),
      DB_HOST: Joi.string().trim().min(1).required(),
      DB_PORT: Joi.number().port().required(),
      GLOBAL_API_PREFIX: Joi.string()
        .trim()
        .regex(/v([1-9]+)/)
        .required(),
      JWT_SECRET_KEY: Joi.string().trim().min(1).required(),
      JWT_TOKEN_EXPIRATION: Joi.string().trim().min(1).required(),
      SENDGRID_API_KEY: Joi.string().trim().min(1).required(),
      FROM_EMAIL: Joi.string().email().required(),
      MAILTRAP_HOST: Joi.string().required(),
      MAILTRAP_PORT: Joi.string().required(),
      MAILTRAP_USER: Joi.string().required(),
      MAILTRAP_PASS: Joi.string().required(),
    });
    return schema;
  }

  private validateEnvSchema(keyValuePairs) {
    const envSchema = this.getEnvSchema();
    const validationResult = envSchema.validate(keyValuePairs, {
      allowUnknown: true,
    });

    if (validationResult.error) {
      throw new Error(
        `Validation failed for .env file. ${validationResult.error.message}.`
      );
    }

    return validationResult.value;
  }

  private get(key: string): string {
    return this.envConfig[key];
  }

  getBaseUrl() {
    return this.get("BASE_URL");
  }

  getFrontendUrl() {
    return this.get("FRONTEND_URL");
  }

  getEnvironment() {
    return this.get("NODE_ENV");
  }

  getPort() {
    return this.get("PORT") || 8080;
  }

  getDBUsername() {
    return this.get("DB_USERNAME");
  }

  getDBPassword() {
    return this.get("DB_PASSWORD");
  }

  getDBName() {
    return this.get("DB_NAME");
  }

  getDBHost() {
    return this.get("DB_HOST");
  }

  getDBPort() {
    return this.get("DB_PORT");
  }

  getSyncDB() {
    return this.get("SYNC_DB");
  }

  getJWTSecretKey() {
    return this.get("JWT_SECRET_KEY");
  }

  getJWTTokenExpiration() {
    return this.get("JWT_TOKEN_EXPIRATION");
  }

  getGlobalAPIPrefix() {
    return this.get("GLOBAL_API_PREFIX");
  }

  getSendgridApiKey(): string {
    return this.get("SENDGRID_API_KEY");
  }

  getMailtrapHost(): string {
    return this.get("MAILTRAP_HOST");
  }

  getMailtrapPort(): string {
    return this.get("MAILTRAP_PORT");
  }

  getMailtrapUser(): string {
    return this.get("MAILTRAP_USER");
  }

  getMailtrapPass(): string {
    return this.get("MAILTRAP_PASS");
  }

  getEmailToSendEmailsFrom(): string {
    return this.get("FROM_EMAIL");
  }

  getWinstonOptions() {
    const options = {
      file: {
        level: "info",
        filename: `${AppRootPath.path}/logs/app.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
      },
      error: {
        level: "error",
        filename: `${AppRootPath.path}/logs/error.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
      },
      console: {
        level: "silly",
        handleExceptions: true,
        json: false,
        colorize: true,
      },
    };

    return {
      exitOnError: false, // do not exit on handled exceptions
      transports: [
        new Winston.transports.File(options.file),
        new Winston.transports.File(options.error),
        new Winston.transports.Console(options.console),
      ],
      exceptionHandlers: [new Winston.transports.Console(options.console)],
    };
  }
}
