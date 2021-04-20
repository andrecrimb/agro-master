/*
  Warnings:

  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Orders` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Orders` DROP FOREIGN KEY `orders_ibfk_2`;

-- DropForeignKey
ALTER TABLE `Orders` DROP FOREIGN KEY `orders_ibfk_1`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `role`,
    ADD COLUMN     `nickname` CHAR(100) NOT NULL DEFAULT '',
    ADD COLUMN     `isSuperuser` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN     `isEmployee` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN     `active` BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE `Orders`;

-- CreateTable
CREATE TABLE `Greenhouse` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `label` CHAR(50) NOT NULL,
    `type` ENUM('borbulha', 'seedling') NOT NULL,
    `ownerPropertyId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SeedlingBench` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` CHAR(50) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `lastPlantingDate` DATETIME(3) NOT NULL,
    `firstPaymentDate` DATETIME(3) NOT NULL,
    `greenhouseId` INTEGER NOT NULL,
    `rootstockId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `type` ENUM('seed', 'seedling', 'rootstock', 'borbulha', 'fruit') NOT NULL,
    `orderDate` DATETIME(3) NOT NULL,
    `deliveryDate` DATETIME(3) NOT NULL,
    `nfNumber` CHAR(50) NOT NULL,
    `installmentsNumber` INTEGER NOT NULL DEFAULT 1,
    `userId` INTEGER NOT NULL,
    `customerId` INTEGER NOT NULL,
    `customerPropertyId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderPayment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `method` ENUM('cheque', 'money') NOT NULL DEFAULT 'money',
    `scheduledDate` DATETIME(3) NOT NULL,
    `received` BOOLEAN NOT NULL DEFAULT false,
    `orderId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FruitOrderItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quantity` INTEGER NOT NULL,
    `boxPrice` DOUBLE NOT NULL,
    `orderId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SeedOrderItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` CHAR(50) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `kgPrice` DOUBLE NOT NULL,
    `orderId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RootstockOrderItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quantity` INTEGER NOT NULL,
    `unityPrice` DOUBLE NOT NULL,
    `orderId` INTEGER NOT NULL,
    `rootstockId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BorbulhaOrderItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` CHAR(50) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `unityPrice` DOUBLE NOT NULL,
    `greenhouseId` INTEGER NOT NULL,
    `orderId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SeedlingBenchOrderItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quantity` INTEGER NOT NULL,
    `unityPrice` DOUBLE NOT NULL,
    `seedlingBenchId` INTEGER NOT NULL,
    `orderId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Greenhouse` ADD FOREIGN KEY (`ownerPropertyId`) REFERENCES `OwnerProperty`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SeedlingBench` ADD FOREIGN KEY (`greenhouseId`) REFERENCES `Greenhouse`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SeedlingBench` ADD FOREIGN KEY (`rootstockId`) REFERENCES `Rootstock`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SeedlingBench` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD FOREIGN KEY (`customerId`, `customerPropertyId`) REFERENCES `CustomerProperty`(`customerId`, `propertyId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderPayment` ADD FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FruitOrderItem` ADD FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SeedOrderItem` ADD FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RootstockOrderItem` ADD FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RootstockOrderItem` ADD FOREIGN KEY (`rootstockId`) REFERENCES `Rootstock`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BorbulhaOrderItem` ADD FOREIGN KEY (`greenhouseId`) REFERENCES `Greenhouse`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BorbulhaOrderItem` ADD FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SeedlingBenchOrderItem` ADD FOREIGN KEY (`seedlingBenchId`) REFERENCES `SeedlingBench`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SeedlingBenchOrderItem` ADD FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
