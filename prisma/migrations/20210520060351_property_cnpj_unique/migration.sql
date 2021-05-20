/*
  Warnings:

  - A unique constraint covering the columns `[cnpj]` on the table `Property` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `BorbulhaOrderItem` MODIFY `name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Customer` MODIFY `name` VARCHAR(191) NOT NULL,
    MODIFY `lastName` VARCHAR(191) NOT NULL,
    MODIFY `nickname` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `address` VARCHAR(191) NOT NULL,
    MODIFY `zip` VARCHAR(191) NOT NULL,
    MODIFY `city` VARCHAR(191) NOT NULL,
    MODIFY `state` VARCHAR(191) NOT NULL,
    MODIFY `country` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Greenhouse` MODIFY `label` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Order` MODIFY `nfNumber` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `PhoneNumber` MODIFY `label` VARCHAR(191) NOT NULL,
    MODIFY `number` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Property` MODIFY `producerName` VARCHAR(191) NOT NULL,
    MODIFY `name` VARCHAR(191) NOT NULL,
    MODIFY `cnpj` VARCHAR(191) NOT NULL,
    MODIFY `cpf` VARCHAR(191) NOT NULL,
    MODIFY `ie` VARCHAR(191) NOT NULL,
    MODIFY `address` VARCHAR(191) NOT NULL,
    MODIFY `zip` VARCHAR(191) NOT NULL,
    MODIFY `city` VARCHAR(191) NOT NULL,
    MODIFY `state` VARCHAR(191) NOT NULL,
    MODIFY `country` VARCHAR(191) NOT NULL DEFAULT 'Brazil';

-- AlterTable
ALTER TABLE `Rootstock` MODIFY `name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `SeedOrderItem` MODIFY `name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `SeedlingBench` MODIFY `name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `firstName` VARCHAR(191) NOT NULL,
    MODIFY `lastName` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `password` VARCHAR(255) NOT NULL,
    MODIFY `nickname` VARCHAR(191) NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX `Property.cnpj_unique` ON `Property`(`cnpj`);
