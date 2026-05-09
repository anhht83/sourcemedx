import { MigrationInterface, QueryRunner } from 'typeorm'

export class Tokens1739978596919 implements MigrationInterface {
  name = 'Tokens1739978596919'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "tokens"
        (
            "id"         uuid                     NOT NULL DEFAULT uuid_generate_v4(),
            "user_id"    UUID,
            "token"      VARCHAR(255) UNIQUE      NOT NULL,
            "token_type" VARCHAR(255)             NOT NULL DEFAULT 'access', --'refresh', 'access', 'reset-password'
            "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            CONSTRAINT "PK_tokens_id" PRIMARY KEY ("id"),
            CONSTRAINT "FK_tokens_user_id" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE
        );
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "tokens"`)
  }
}
