import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateUsers1738692876619 implements MigrationInterface {
  name = 'CreateUsers1738692876619'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `)

    await queryRunner.query(`
        CREATE TABLE "users"
        (
            "id"         uuid                     NOT NULL DEFAULT uuid_generate_v4(),
            "email"      character varying        NOT NULL,
            "password"   character varying        NOT NULL,
            "first_name" character varying        NOT NULL,
            "last_name"  character varying        NOT NULL,
            "company"    character varying        NOT NULL,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            CONSTRAINT "UQ_users_email" UNIQUE ("email"),
            CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
        );
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`)
  }
}
