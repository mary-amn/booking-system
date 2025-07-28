import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBookingHistory1753567794078 implements MigrationInterface {
  name = 'AddBookingHistory1753567794078';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."booking_history_eventtype_enum" AS ENUM('pending', 'confirmed', 'canceled')`,
    );
    await queryRunner.query(
      `CREATE TABLE "booking_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bookingId" character varying NOT NULL, "eventType" "public"."booking_history_eventtype_enum" NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "details" jsonb, CONSTRAINT "PK_3bca51c9ed1c56768e390bac1aa" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "booking_history"`);
    await queryRunner.query(
      `DROP TYPE "public"."booking_history_eventtype_enum"`,
    );
  }
}
