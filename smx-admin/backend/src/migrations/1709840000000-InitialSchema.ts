import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1709840000000 implements MigrationInterface {
  name = 'InitialSchema1709840000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create admin_permission_enum type
    await queryRunner.query(`
      CREATE TYPE "public"."admin_permission_enum" AS ENUM(
        'VIEW_ADMINS', 'CREATE_ADMINS', 'UPDATE_ADMINS', 'DELETE_ADMINS', 'BLOCK_ADMINS',
        'VIEW_LOGS', 'EXPORT_LOGS'
      )
    `);

    // Create admin_role_name_enum type
    await queryRunner.query(`
      CREATE TYPE "public"."admin_role_name_enum" AS ENUM('SUPER_ADMIN', 'ADMIN', 'SUPPORT')
    `);

    await queryRunner.query(`
      CREATE TABLE "admin_roles" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" "public"."admin_role_name_enum" NOT NULL,
        "description" character varying,
        "permissions" "public"."admin_permission_enum"[] NOT NULL DEFAULT '{}',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_admin_roles" PRIMARY KEY ("id")
      )
    `);

    // Create admin_users table
    await queryRunner.query(`
      CREATE TABLE "admin_users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "username" character varying NOT NULL,
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "last_login_at" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "role_id" uuid,
        CONSTRAINT "UQ_admin_users_username" UNIQUE ("username"),
        CONSTRAINT "UQ_admin_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_admin_users" PRIMARY KEY ("id"),
        CONSTRAINT "FK_admin_users_role" FOREIGN KEY ("role_id") REFERENCES "admin_roles"("id")
      )
    `);

    // Create admin_refresh_tokens table
    await queryRunner.query(`
      CREATE TABLE "admin_refresh_tokens" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "token" character varying NOT NULL,
        "is_revoked" boolean NOT NULL DEFAULT false,
        "user_agent" character varying NOT NULL,
        "ip_address" character varying NOT NULL,
        "expires_at" TIMESTAMP NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "admin_id" uuid,
        CONSTRAINT "PK_admin_refresh_tokens" PRIMARY KEY ("id"),
        CONSTRAINT "FK_admin_refresh_tokens_admin" FOREIGN KEY ("admin_id") REFERENCES "admin_users"("id") ON DELETE CASCADE
      )
    `);

    // Create activity_types enum
    await queryRunner.query(`
      CREATE TYPE "public"."activity_type_enum" AS ENUM('CREATE', 'UPDATE', 'DELETE', 'BLOCK', 'UNBLOCK', 'LOGIN', 'LOGOUT')
    `);

    // Create activity_logs table
    await queryRunner.query(`
      CREATE TABLE "activity_logs" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "entity_type" character varying NOT NULL,
        "activity_type" "public"."activity_type_enum" NOT NULL,
        "details" jsonb,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "admin_id" uuid,
        CONSTRAINT "PK_activity_logs" PRIMARY KEY ("id"),
        CONSTRAINT "FK_activity_logs_admin" FOREIGN KEY ("admin_id") REFERENCES "admin_users"("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "activity_logs"`);
    await queryRunner.query(`DROP TYPE "public"."activity_type_enum"`);
    await queryRunner.query(`DROP TABLE "admin_refresh_tokens"`);
    await queryRunner.query(`DROP TABLE "admin_users"`);
    await queryRunner.query(`DROP TABLE "admin_roles"`);
    await queryRunner.query(`DROP TYPE "public"."admin_role_name_enum"`);
    await queryRunner.query(`DROP TYPE "public"."admin_permission_enum"`);
  }
}
