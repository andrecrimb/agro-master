/*
  Warnings:

  - You are about to drop the column `propertyId` on the `Property` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Property` DROP FOREIGN KEY `property_ibfk_1`;

-- AlterTable
ALTER TABLE `Property` DROP COLUMN `propertyId`;

-- CreateTable
CREATE TABLE `_OwnerProperties` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,
UNIQUE INDEX `_OwnerProperties_AB_unique`(`A`, `B`),
INDEX `_OwnerProperties_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_OwnerProperties` ADD FOREIGN KEY (`A`) REFERENCES `Property`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_OwnerProperties` ADD FOREIGN KEY (`B`) REFERENCES `Property`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
