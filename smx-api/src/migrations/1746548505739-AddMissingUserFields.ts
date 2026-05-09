import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddMissingUserFields1746548505739 implements MigrationInterface {
  name = 'AddMissingUserFields1746548505739'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create user_role enum
    await queryRunner.query(`
      CREATE TYPE "public"."user_role_enum" AS ENUM('BUYER', 'SUPPLIER')
    `)

    await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE "users" ADD COLUMN "role" "public"."user_role_enum" NOT NULL DEFAULT 'BUYER';
      EXCEPTION
        WHEN duplicate_column THEN null;
      END $$;
    `)

    await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE "users" ADD COLUMN "is_active" boolean NOT NULL DEFAULT true;
      EXCEPTION
        WHEN duplicate_column THEN null;
      END $$;
    `)

    await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE "users" ADD COLUMN "last_login_at" TIMESTAMP;
      EXCEPTION
        WHEN duplicate_column THEN null;
      END $$;
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop columns
    await queryRunner.query(`
      ALTER TABLE "users" DROP COLUMN IF EXISTS "last_login_at";
      ALTER TABLE "users" DROP COLUMN IF EXISTS "is_active";
      ALTER TABLE "users" DROP COLUMN IF EXISTS "role";
    `)

    // Drop user_role enum
    await queryRunner.query(`
      DROP TYPE IF EXISTS "public"."user_role_enum";
    `)
  }
}
