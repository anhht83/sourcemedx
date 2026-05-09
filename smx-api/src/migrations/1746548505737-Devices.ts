import { MigrationInterface, QueryRunner } from 'typeorm'

export class Devices1746548505737 implements MigrationInterface {
  name = 'Devices1746548505737'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      CREATE EXTENSION IF NOT EXISTS "vector";
      
      CREATE TABLE devices (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" TEXT NOT NULL,
        "description" TEXT,
        "terms" JSONB,
        "search_text" TEXT NOT NULL,
        "search_vector" TSVECTOR GENERATED ALWAYS AS (to_tsvector('english', search_text)) STORED,
        "embedding" VECTOR(1536),
        "source" TEXT,
        "source_id" UUID,
        "created_at"  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at"  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        
        CONSTRAINT uq_devices_source_source_id UNIQUE (source, source_id)
      );
      
      CREATE INDEX idx_devices_search_vector ON devices USING GIN(search_vector);
      CREATE INDEX idx_devices_embedding ON devices USING ivfflat (embedding vector_cosine_ops);
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "devices"`)
  }
}
