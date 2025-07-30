import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common"; // import built-in ValidationPipe
import { ConfigService } from "./config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { NestExpressApplication } from "@nestjs/platform-express";
import { urlencoded, json } from "express";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  app.set("trust proxy");

  // Global prefix for API versioning
  app.setGlobalPrefix(configService.getGlobalAPIPrefix());

  // Configuration for the size of the payload coming from FE
  app.use(json({ limit: "100mb" }));
  app.use(urlencoded({ extended: true, limit: "100mb" }));

  // Enable cors
  app.enableCors();

  // Apply global pipe for incoming data validation
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );

  // Swagger configuration for API documentation
  const options = new DocumentBuilder()
    .setTitle("Luma Claims")
    .setBasePath(configService.getGlobalAPIPrefix())
    .setDescription("Official API documentation")
    .setVersion("1.0.0")
    .addBearerAuth({ type: "http", bearerFormat: "JWT", scheme: "bearer" })
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("docs", app, document);

  // Finally expose the port given in .env file for listening to the connections
  await app.listen(configService.getPort());
}

bootstrap();
