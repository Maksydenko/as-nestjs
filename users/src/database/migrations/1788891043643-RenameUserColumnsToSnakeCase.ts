import type { MigrationInterface, QueryRunner } from 'typeorm'

export class RenameUserColumnsToSnakeCase1788891043643 implements MigrationInterface {
  name = 'RenameUserColumnsToSnakeCase1788891043643'

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "mobile_number" TO "mobileNumber"`
    )
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "last_name" TO "lastName"`
    )
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "first_name" TO "firstName"`
    )
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "firstName" TO "first_name"`
    )
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "lastName" TO "last_name"`
    )
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "mobileNumber" TO "mobile_number"`
    )
  }
}
