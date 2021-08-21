/*
  Warnings:

  - A unique constraint covering the columns `[label,greenhouseId]` on the table `SeedlingBench` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `labelGreenhouse` ON `SeedlingBench`(`label`, `greenhouseId`);
