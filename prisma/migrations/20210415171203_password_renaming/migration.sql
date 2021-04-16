/*
  Warnings:

  - You are about to drop the column `passwort` on the `User` table. All the data in the column will be lost.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `passwort`,
    ADD COLUMN     `password` CHAR(255) NOT NULL;
