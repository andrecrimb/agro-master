-- AlterTable
ALTER TABLE `Order` ADD COLUMN `status` ENUM('canceled', 'issued') NOT NULL DEFAULT 'issued';
