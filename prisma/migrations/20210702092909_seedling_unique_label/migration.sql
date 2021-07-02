/*
  Warnings:

  - A unique constraint covering the columns `[label]` on the table `SeedlingBench` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `SeedlingBench.label_unique` ON `SeedlingBench`(`label`);
