import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateFdaRecalls1746548505740 implements MigrationInterface {
  name = 'CreateFdaRecalls1746548505740'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      CREATE EXTENSION IF NOT EXISTS "vector";
      CREATE EXTENSION IF NOT EXISTS pg_trgm;

      CREATE TABLE fda_recalls (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "cfres_id" TEXT,
        "product_res_number" TEXT,
        "event_date_initiated" DATE,
        "event_date_posted" DATE,
        "recall_status" TEXT,
        "res_event_number" TEXT,
        "product_code" TEXT,
        "k_numbers" JSONB,
        "product_description" TEXT,
        "code_info" TEXT,
        "recalling_firm" TEXT,
        "address1" TEXT,
        "city" TEXT,
        "reason_for_recall" TEXT,
        "root_cause_description" TEXT,
        "action" TEXT,
        "product_quantity" TEXT,
        "distribution_pattern" TEXT,
        "openfda" JSONB,
        "search_text" TEXT,
         "search_vector" TSVECTOR GENERATED ALWAYS AS (to_tsvector('english', search_text)) STORED,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
      );

      CREATE INDEX idx_fda_recalls_search_vector ON fda_recalls USING gin(search_vector);
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS fda_recalls;
    `)
  }
}
