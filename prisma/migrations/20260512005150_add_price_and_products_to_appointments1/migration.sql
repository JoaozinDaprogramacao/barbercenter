/*
  Warnings:

  - You are about to drop the column `totalPrice` on the `appointments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `appointments` DROP COLUMN `totalPrice`,
    ADD COLUMN `price` DOUBLE NULL DEFAULT 0;
