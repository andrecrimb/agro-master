/*
  Warnings:

  - You are about to drop the `_OwnerProperties` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_OwnerProperties` DROP FOREIGN KEY `_ownerproperties_ibfk_1`;

-- DropForeignKey
ALTER TABLE `_OwnerProperties` DROP FOREIGN KEY `_ownerproperties_ibfk_2`;

-- AlterTable
ALTER TABLE `Property` ADD COLUMN     `propertyId` INTEGER;

-- DropTable
DROP TABLE `_OwnerProperties`;

-- CreateTable
CREATE TABLE `OwnerProperties` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `propertyId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `OwnerProperties` ADD FOREIGN KEY (`propertyId`) REFERENCES `Property`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Property` ADD FOREIGN KEY (`propertyId`) REFERENCES `Property`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
