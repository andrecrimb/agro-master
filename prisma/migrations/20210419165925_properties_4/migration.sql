/*
  Warnings:

  - You are about to drop the `_OwnerProperties` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[propertyId]` on the table `Property` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `_OwnerProperties` DROP FOREIGN KEY `_ownerproperties_ibfk_1`;

-- DropForeignKey
ALTER TABLE `_OwnerProperties` DROP FOREIGN KEY `_ownerproperties_ibfk_2`;

-- AlterTable
ALTER TABLE `Property` ADD COLUMN     `propertyId` INTEGER;

-- DropTable
DROP TABLE `_OwnerProperties`;

-- CreateIndex
CREATE UNIQUE INDEX `Property_propertyId_unique` ON `Property`(`propertyId`);

-- AddForeignKey
ALTER TABLE `Property` ADD FOREIGN KEY (`propertyId`) REFERENCES `Property`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
