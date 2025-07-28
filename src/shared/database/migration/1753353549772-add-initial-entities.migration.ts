import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInitialEntities1753353549772 implements MigrationInterface {
  name = 'AddInitialEntities1753353549772';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" BIGSERIAL NOT NULL, "email" character varying(191) NOT NULL, "name" character varying(191) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "resources" ("id" BIGSERIAL NOT NULL, "name" text NOT NULL, "capacity" integer NOT NULL DEFAULT '1', "timezone" text NOT NULL DEFAULT 'UTC', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_632484ab9dff41bba94f9b7c85e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bookings_status_enum" AS ENUM('pending', 'confirmed', 'canceled')`,
    );
    await queryRunner.query(
      `CREATE TABLE "bookings" ("id" BIGSERIAL NOT NULL, "resourceId" bigint NOT NULL, "userId" bigint NOT NULL, "startsAt" TIMESTAMP NOT NULL, "endsAt" TIMESTAMP NOT NULL, "status" "public"."bookings_status_enum" NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_bee6805982cc1e248e94ce94957" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1ff828a05514eb042b1f143f63" ON "bookings" ("resourceId", "startsAt", "endsAt") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1ff828a05514eb042b1f143f63"`,
    );
    await queryRunner.query(`DROP TABLE "bookings"`);
    await queryRunner.query(`DROP TYPE "public"."bookings_status_enum"`);
    await queryRunner.query(`DROP TABLE "resources"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
