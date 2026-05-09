import { MigrationInterface, QueryRunner } from 'typeorm'

export class ChatMessage1740326607606 implements MigrationInterface {
  name = 'ChatMessage1740326607606'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ⚡ Create chat_messages table
    await queryRunner.query(`
        CREATE TABLE "chat_messages"
        (
            "id"           uuid                     NOT NULL DEFAULT uuid_generate_v4(),
            "thread_id"    uuid                     NOT NULL,
            "sender"       VARCHAR(50)              NOT NULL, -- 'user', 'ai'
            "message"      TEXT                     NOT NULL,
            "search_status" VARCHAR(50),                       -- EAiSearchRequestStatus
            "context"      JSONB,                             -- search context
            "created_at"   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updated_at"   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            CONSTRAINT "PK_chat_messages_id" PRIMARY KEY ("id"),
            CONSTRAINT "FK_chat_messages_thread_id" FOREIGN KEY ("thread_id") REFERENCES "chat_threads" ("id") ON DELETE CASCADE
        );
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "chat_messages"`)
  }
}
