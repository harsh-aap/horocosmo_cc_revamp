import { MigrationInterface, QueryRunner } from "typeorm";

export class RemovedBioAvatarUserEntity1768894799960 implements MigrationInterface {
    name = 'RemovedBioAvatarUserEntity1768894799960'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "current_balance" numeric(10,2) NOT NULL DEFAULT '0', "total_credited" numeric(10,2) NOT NULL DEFAULT '0', "total_debited" numeric(10,2) NOT NULL DEFAULT '0', "balance_updated_at" TIMESTAMP NOT NULL DEFAULT NOW(), "bio" text, "avatar_url" text, "preferences" jsonb, "total_consultations" integer NOT NULL DEFAULT '0', "completed_consultations" integer NOT NULL DEFAULT '0', "average_rating" numeric(3,2) NOT NULL DEFAULT '0', "total_ratings" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_6ca9503d77ae39b4b5a6cc3ba8" UNIQUE ("user_id"), CONSTRAINT "PK_1ec6662219f4605723f1e41b6cb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6ca9503d77ae39b4b5a6cc3ba8" ON "user_profiles" ("user_id") `);
        await queryRunner.query(`CREATE TABLE "astrologer_profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "astrologer_id" uuid NOT NULL, "chat_rate_per_minute" numeric(10,2) NOT NULL DEFAULT '0', "call_rate_per_minute" numeric(10,2) NOT NULL DEFAULT '0', "max_concurrent_sessions" integer NOT NULL DEFAULT '1', "last_active_at" TIMESTAMP, "performance_metrics" jsonb, "specializations" jsonb, "monthly_sessions" integer NOT NULL DEFAULT '0', "monthly_rating" numeric(3,2) NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_2701c7643fd0c6d48b12b489c9" UNIQUE ("astrologer_id"), CONSTRAINT "PK_2bc229cbf1e9bf816774f9847a0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2701c7643fd0c6d48b12b489c9" ON "astrologer_profiles" ("astrologer_id") `);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatar_url"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "bio"`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ADD CONSTRAINT "FK_6ca9503d77ae39b4b5a6cc3ba88" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "astrologer_profiles" ADD CONSTRAINT "FK_2701c7643fd0c6d48b12b489c9c" FOREIGN KEY ("astrologer_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "astrologer_profiles" DROP CONSTRAINT "FK_2701c7643fd0c6d48b12b489c9c"`);
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP CONSTRAINT "FK_6ca9503d77ae39b4b5a6cc3ba88"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "bio" text`);
        await queryRunner.query(`ALTER TABLE "users" ADD "avatar_url" text`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2701c7643fd0c6d48b12b489c9"`);
        await queryRunner.query(`DROP TABLE "astrologer_profiles"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6ca9503d77ae39b4b5a6cc3ba8"`);
        await queryRunner.query(`DROP TABLE "user_profiles"`);
    }

}
