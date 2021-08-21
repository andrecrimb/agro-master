/*
  Warnings:

  - A unique constraint covering the columns `[label,ownerPropertyId]` on the table `Greenhouse` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `labelProperty` ON `Greenhouse`(`label`, `ownerPropertyId`);
