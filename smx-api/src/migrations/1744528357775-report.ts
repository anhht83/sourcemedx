import { MigrationInterface, QueryRunner } from 'typeorm'

export class Report1744528357775 implements MigrationInterface {
  name = 'Report1744528357775'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `)
    await queryRunner.query(`
        CREATE TABLE "reports"
        (
            "id"          uuid                     NOT NULL DEFAULT uuid_generate_v4(),
            "thread_id"   uuid                     NOT NULL,
            "report_type" character varying(255),
            "file_url"    TEXT                     NOT NULL,
            "file_type"   character varying(255),
            "file_name"   TEXT,
            "created_at"  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updated_at"  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            CONSTRAINT "PK_reports_id" PRIMARY KEY ("id"),
            CONSTRAINT "FK_reports_thread_id" FOREIGN KEY ("thread_id") REFERENCES "chat_threads" ("id") ON DELETE CASCADE
        );
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "reports"`)
  }
}
