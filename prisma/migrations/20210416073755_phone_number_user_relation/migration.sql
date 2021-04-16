/*
  Warnings:

  - You are about to drop the column `userId` on the `PhoneNumber` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `PhoneNumber` DROP FOREIGN KEY `phonenumber_ibfk_1`;

-- AlterTable
ALTER TABLE `PhoneNumber` DROP COLUMN `userId`;

-- CreateTable
CREATE TABLE `_PhoneNumberToUser` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,
UNIQUE INDEX `_PhoneNumberToUser_AB_unique`(`A`, `B`),
INDEX `_PhoneNumberToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_PhoneNumberToUser` ADD FOREIGN KEY (`A`) REFERENCES `PhoneNumber`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PhoneNumberToUser` ADD FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
