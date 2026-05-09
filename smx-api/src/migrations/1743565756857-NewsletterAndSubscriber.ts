import { MigrationInterface, QueryRunner } from 'typeorm'

export class NewsletterAndSubscriber1743565756857
  implements MigrationInterface
{
  name = 'NewsletterAndSubscriber1743565756857'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "subscribers"
        (
            "id"           uuid              NOT NULL DEFAULT uuid_generate_v4(),
            "email"        character varying NOT NULL,
            "isActive"     boolean           NOT NULL DEFAULT true,
            "subscribedAt" TIMESTAMP         NOT NULL DEFAULT now(),
            CONSTRAINT "UQ_subscribers_email" UNIQUE ("email"),
            CONSTRAINT "PK_subscribers_id" PRIMARY KEY ("id")
        )
    `)
    await queryRunner.query(`
        CREATE TABLE "newsletters"
        (
            "id"      uuid              NOT NULL DEFAULT uuid_generate_v4(),
            "subject" character varying NOT NULL,
            "content" text              NOT NULL,
            "sentAt"  TIMESTAMP         NOT NULL DEFAULT now(),
            CONSTRAINT "PK_newsletters_id" PRIMARY KEY ("id")
        )
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "newsletters"`)
    await queryRunner.query(`DROP TABLE "subscribers"`)
  }
}
