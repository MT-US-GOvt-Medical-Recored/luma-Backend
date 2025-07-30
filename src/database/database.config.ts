import "dotenv/config";
import { DataSourceOptions } from "typeorm";
import { ENTITIES } from "./entities";
import { DeploymentEnvironmentTypes } from "src/shared/enums";

const databaseConfig: DataSourceOptions = {
  type: "postgres",
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT),
  ssl: process.env.NODE_ENV === DeploymentEnvironmentTypes.Production ? {
    rejectUnauthorized: false,
  } : false,
  migrations: ["dist/database/migrations/*{.ts,.js}"],
  entities: ENTITIES,
  synchronize: false,
  migrationsRun: true,
  logging: process.env.NODE_ENV === DeploymentEnvironmentTypes.Development,
};

export default databaseConfig;
