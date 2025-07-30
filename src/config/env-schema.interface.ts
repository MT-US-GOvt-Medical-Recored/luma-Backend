export interface IEnvSchema {
  BASE_URL: string;
  FRONTEND_URL: string;
  NODE_ENV: string;
  PORT: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_HOST: string;
  DB_PORT: number;
  GLOBAL_API_PREFIX: string;
  JWT_SECRET_KEY: string;
  JWT_TOKEN_EXPIRATION: string;
  SENDGRID_API_KEY: string;
  FROM_EMAIL: string;
  MAILTRAP_HOST: string;
  MAILTRAP_PORT: string;
  MAILTRAP_USER: string;
  MAILTRAP_PASS: string;
}
