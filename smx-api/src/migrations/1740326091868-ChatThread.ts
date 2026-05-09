import { MigrationInterface, QueryRunner } from 'typeorm'

export class ChatThread1740326091868 implements MigrationInterface {
  name = 'ChatThread1740326091868'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `)
    await queryRunner.query(`
        CREATE TABLE "chat_threads"
        (
            "id"            uuid                     NOT NULL DEFAULT uuid_generate_v4(),
            "user_id"       uuid                     NOT NULL,
            "title"         character varying(255),
            "context"       jsonb,
            "search_status" VARCHAR(50), -- ESearchStatus
            "created_at"    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updated_at"    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            CONSTRAINT "PK_chat_threads_id" PRIMARY KEY ("id"),
            CONSTRAINT "FK_chat_threads_user_id" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE
        );
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "chat_threads"`)
  }
}
