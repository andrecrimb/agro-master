/*
  Warnings:

  - You are about to alter the column `label` on the `PhoneNumber` table. The data in that column could be lost. The data in that column will be cast from `Char(255)` to `Char(50)`.
  - You are about to alter the column `number` on the `PhoneNumber` table. The data in that column could be lost. The data in that column will be cast from `Char(255)` to `Char(50)`.
  - You are about to alter the column `name` on the `Rootstock` table. The data in that column could be lost. The data in that column will be cast from `Char(255)` to `Char(50)`.
  - You are about to alter the column `firstName` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Char(255)` to `Char(100)`.
  - You are about to alter the column `lastName` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Char(255)` to `Char(100)`.

*/
-- AlterTable
ALTER TABLE `PhoneNumber` MODIFY `label` CHAR(50) NOT NULL,
    MODIFY `number` CHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE `Rootstock` MODIFY `name` CHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `firstName` CHAR(100) NOT NULL,
    MODIFY `lastName` CHAR(100) NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE `Customer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` CHAR(100) NOT NULL,
    `lastName` CHAR(100) NOT NULL,
    `nickname` CHAR(100) NOT NULL DEFAULT '',
    `active` BOOLEAN NOT NULL DEFAULT true,
    `address` CHAR(100) NOT NULL,
    `zip` CHAR(50) NOT NULL,
    `city` CHAR(50) NOT NULL,
    `state` CHAR(50) NOT NULL,
    `country` CHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Property` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `producerName` CHAR(100) NOT NULL,
    `name` CHAR(100) NOT NULL,
    `cnpj` CHAR(50) NOT NULL,
    `cpf` CHAR(50) NOT NULL,
    `ie` CHAR(50) NOT NULL,
    `address` CHAR(100) NOT NULL,
    `zip` CHAR(50) NOT NULL,
    `city` CHAR(50) NOT NULL,
    `state` CHAR(50) NOT NULL,
    `country` CHAR(50) NOT NULL,
    `propertyId` INTEGER,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CustomerToPhoneNumber` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,
UNIQUE INDEX `_CustomerToPhoneNumber_AB_unique`(`A`, `B`),
INDEX `_CustomerToPhoneNumber_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CustomerToProperty` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,
UNIQUE INDEX `_CustomerToProperty_AB_unique`(`A`, `B`),
INDEX `_CustomerToProperty_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Property` ADD FOREIGN KEY (`propertyId`) REFERENCES `Property`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CustomerToPhoneNumber` ADD FOREIGN KEY (`A`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CustomerToPhoneNumber` ADD FOREIGN KEY (`B`) REFERENCES `PhoneNumber`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CustomerToProperty` ADD FOREIGN KEY (`A`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CustomerToProperty` ADD FOREIGN KEY (`B`) REFERENCES `Property`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
