import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateGudidDevices1742633019325 implements MigrationInterface {
  name = 'CreateGudidDevices1742633019325'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS pg_trgm;

      CREATE TABLE gudid_devices (
        public_device_record_key TEXT PRIMARY KEY,
        primary_di_number TEXT,
        gtin TEXT,
        public_version_status TEXT,
        public_version_number INT,
        public_version_date DATE,
        device_record_status TEXT,
        brand_name TEXT,
        company_name TEXT,
        duns_number TEXT,
        device_description TEXT,
        contacts JSONB,
        device_sizes JSONB,
        identifiers JSONB,
        gmdn_terms JSONB,
        product_codes JSONB,
        environmental_conditions JSONB,
        sterilization JSONB,
        premarket_submissions JSONB,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
      );
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS gudid_devices`)
  }
}
