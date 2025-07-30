import { BadRequestException, Injectable } from "@nestjs/common";
import { DataSource, QueryRunner } from "typeorm";

type TransactionCallback = (queryRunner: QueryRunner) => any | never;

@Injectable()
export class DatabaseService {
  constructor(private readonly dataSource: DataSource) {}

  async runWithTransaction<T>(callback: TransactionCallback) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();
      const response = await callback(queryRunner);
      await queryRunner.commitTransaction();
      return response as T;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(e.message || e || "Transaction failed");
    } finally {
      await queryRunner.release();
    }
  }
}
