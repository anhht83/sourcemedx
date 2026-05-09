import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateActivityLogsTable1710864000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create entity_type enum if it doesn't exist
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "public"."activity_logs_entity_type_enum" AS ENUM('ADMIN', 'USER', 'ROLE');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Add entity_id column if it doesn't exist
    await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE "activity_logs" ADD COLUMN "entity_id" character varying NOT NULL DEFAULT '';
      EXCEPTION
        WHEN duplicate_column THEN null;
      END $$;
    `);

    // Add ip_address column if it doesn't exist
    await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE "activity_logs" ADD COLUMN "ip_address" character varying NOT NULL DEFAULT '127.0.0.1';
      EXCEPTION
        WHEN duplicate_column THEN null;
      END $$;
    `);

    // Add user_agent column if it doesn't exist
    await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE "activity_logs" ADD COLUMN "user_agent" character varying NOT NULL DEFAULT '';
      EXCEPTION
        WHEN duplicate_column THEN null;
      END $$;
    `);

    // Create indexes if they don't exist
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE INDEX "IDX_activity_logs_entity" ON "activity_logs" ("entity_type", "entity_id");
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        CREATE INDEX "IDX_activity_logs_activity" ON "activity_logs" ("activity_type", "created_at");
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        CREATE INDEX "IDX_activity_logs_admin" ON "activity_logs" ("admin_id", "created_at");
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_activity_logs_admin"`);
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_activity_logs_activity"`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_activity_logs_entity"`);

    // Drop columns
    await queryRunner.query(
      `ALTER TABLE "activity_logs" DROP COLUMN IF EXISTS "user_agent"`,
    );
    await queryRunner.query(
      `ALTER TABLE "activity_logs" DROP COLUMN IF EXISTS "ip_address"`,
    );
    await queryRunner.query(
      `ALTER TABLE "activity_logs" DROP COLUMN IF EXISTS "entity_id"`,
    );

    // Drop enum type
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."activity_logs_entity_type_enum"`,
    );
  }
}
