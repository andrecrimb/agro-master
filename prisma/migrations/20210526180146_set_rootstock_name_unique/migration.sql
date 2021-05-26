/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Rootstock` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Rootstock.name_unique` ON `Rootstock`(`name`);
