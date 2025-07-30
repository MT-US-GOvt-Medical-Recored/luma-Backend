import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateSessionsTable1753878166182 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "sessions" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
                "deleted_at" TIMESTAMP WITH TIME ZONE, 
                "created_by" character varying, 
                "updated_by" character varying, 
                "deleted_by" character varying, 
                "is_authenticated" boolean NOT NULL, 
                "user_id" uuid
            );
        `);
        await queryRunner.query(`
            ALTER TABLE "sessions" ADD CONSTRAINT "FK_085d540d9f418cfbdc7bd55bb19" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "sessions" DROP CONSTRAINT IF EXISTS "FK_085d540d9f418cfbdc7bd55bb19";
        `);

        // Drop tables
        await queryRunner.query(`
            DROP TABLE IF EXISTS "sessions";
        `);
    }

}
