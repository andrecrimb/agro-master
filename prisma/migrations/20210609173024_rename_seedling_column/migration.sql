/*
  Warnings:

  - You are about to drop the column `name` on the `SeedlingBench` table. All the data in the column will be lost.
  - Added the required column `label` to the `SeedlingBench` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `SeedlingBench` DROP COLUMN `name`,
    ADD COLUMN `label` VARCHAR(191) NOT NULL;
