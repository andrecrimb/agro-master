/*
  Warnings:

  - You are about to drop the `_CustomerToProperty` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_CustomerToProperty` DROP FOREIGN KEY `_customertoproperty_ibfk_1`;

-- DropForeignKey
ALTER TABLE `_CustomerToProperty` DROP FOREIGN KEY `_customertoproperty_ibfk_2`;

-- DropTable
DROP TABLE `_CustomerToProperty`;

-- CreateTable
CREATE TABLE `CustomerProperty` (
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `customerId` INTEGER NOT NULL,
    `propertyId` INTEGER NOT NULL,

    PRIMARY KEY (`customerId`,`propertyId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `type` ENUM('seed', 'seedling', 'rootstock', 'borbulha', 'fruit') NOT NULL,
    `orderDate` DATETIME(3) NOT NULL,
    `deliveryDate` DATETIME(3) NOT NULL,
    `invoiceNumber` CHAR(50) NOT NULL,
    `installmentsNumber` INTEGER NOT NULL DEFAULT 1,
    `userId` INTEGER NOT NULL,
    `customerId` INTEGER NOT NULL,
    `propertyId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CustomerProperty` ADD FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerProperty` ADD FOREIGN KEY (`propertyId`) REFERENCES `Property`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Orders` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Orders` ADD FOREIGN KEY (`customerId`, `propertyId`) REFERENCES `CustomerProperty`(`customerId`, `propertyId`) ON DELETE CASCADE ON UPDATE CASCADE;
