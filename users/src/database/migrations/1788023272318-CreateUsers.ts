import type { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateUsers1788023272318 implements MigrationInterface {
  name = 'CreateUsers1788023272318'

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`)
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("email" character varying NOT NULL, "firstName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lastName" character varying NOT NULL, "mobileNumber" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_61dc14c8c49c187f5d08047c985" UNIQUE ("mobileNumber"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
    )
  }
}
