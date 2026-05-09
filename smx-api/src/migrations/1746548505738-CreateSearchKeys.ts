import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateSearchKeys1746548505738 implements MigrationInterface {
  name = 'CreateSearchKeys1746548505738'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create search_key_status enum
    await queryRunner.query(`
      CREATE TYPE "public"."search_key_status_enum" AS ENUM('AVAILABLE', 'USED', 'EXPIRED', 'CANCELLED')
    `)

    // Create search_keys table
    await queryRunner.query(`
      CREATE TABLE "search_keys" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "key" character varying NOT NULL,
        "status" "public"."search_key_status_enum" NOT NULL DEFAULT 'AVAILABLE',
        "expires_at" TIMESTAMP NOT NULL,
        "is_used" boolean NOT NULL DEFAULT false,
        "used_at" TIMESTAMP,
        "price" numeric(10,2) NOT NULL,
        "discount_applied" numeric(10,2),
        "stripe_payment_id" character varying,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "user_id" uuid,
        CONSTRAINT "UQ_search_keys_key" UNIQUE ("key"),
        CONSTRAINT "PK_search_keys" PRIMARY KEY ("id"),
        CONSTRAINT "FK_search_keys_user" FOREIGN KEY ("user_id") REFERENCES "users"("id")
      )
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "search_keys"`)
    await queryRunner.query(`DROP TYPE "public"."search_key_status_enum"`)
  }
}
