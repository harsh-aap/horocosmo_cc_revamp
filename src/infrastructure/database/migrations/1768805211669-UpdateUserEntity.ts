import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserEntity1768805211669 implements MigrationInterface {
    name = 'UpdateUserEntity1768805211669'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "rating"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "total_consultations"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "completed_consultations"`);
        await queryRunner.query(`CREATE TYPE "public"."users_consultation_availability_enum" AS ENUM('available', 'unavailable', 'busy', 'offline')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "consultation_availability" "public"."users_consultation_availability_enum" NOT NULL DEFAULT 'offline'`);
        await queryRunner.query(`CREATE TYPE "public"."users_session_status_enum" AS ENUM('idle', 'in_session')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "session_status" "public"."users_session_status_enum" NOT NULL DEFAULT 'idle'`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "phone" SET NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_a000cca60bcf04454e72769949" ON "users" ("phone") `);
        await queryRunner.query(`CREATE INDEX "IDX_aed8a6c376b1f2b039854fa4f4" ON "users" ("consultation_availability") `);
        await queryRunner.query(`CREATE INDEX "IDX_b080e2e4d9e0028ac951778481" ON "users" ("session_status") `);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "CHK_798af42ad38241e71427cb7ce6" CHECK ("consultation_availability" IN ('available', 'unavailable', 'busy', 'offline'))`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "CHK_649bf7cf7d5b365a7e5c4b7488" CHECK ("session_status" IN ('idle', 'in_session'))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "CHK_649bf7cf7d5b365a7e5c4b7488"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "CHK_798af42ad38241e71427cb7ce6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b080e2e4d9e0028ac951778481"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_aed8a6c376b1f2b039854fa4f4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a000cca60bcf04454e72769949"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "phone" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "session_status"`);
        await queryRunner.query(`DROP TYPE "public"."users_session_status_enum"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "consultation_availability"`);
        await queryRunner.query(`DROP TYPE "public"."users_consultation_availability_enum"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "completed_consultations" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "total_consultations" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "rating" numeric(3,2)`);
        await queryRunner.query(`CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
    }

}
