import { Global, Module } from "@nestjs/common";
import { DatabaseProvider } from "./database.provider";
import { DatabaseService } from "./database.service";

@Global()
@Module({
  providers: [DatabaseService],
  imports: [...DatabaseProvider],
  exports: [...DatabaseProvider, DatabaseService],
})
export class DatabaseModule {}
