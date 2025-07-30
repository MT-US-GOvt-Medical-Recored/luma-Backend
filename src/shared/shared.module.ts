import { Module } from "@nestjs/common";
import { HashService, EmailService } from "./services";
import { ConfigModule } from "src/config";

@Module({
  imports: [ConfigModule],
  providers: [HashService, EmailService],
  exports: [HashService, EmailService],
})
export class SharedModule {}
