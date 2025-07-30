import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateAllNeccesaryTables1752063102020 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create tables
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "created_by" uuid,
                "updated_by" uuid,
                "deleted_by" uuid,
                "full_name" varchar NOT NULL,
                "google_id" varchar,
                "email" varchar UNIQUE NOT NULL,
                "password" varchar NOT NULL
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop tables
        await queryRunner.query(`
            DROP TABLE IF EXISTS "users";
        `);

    }
}
