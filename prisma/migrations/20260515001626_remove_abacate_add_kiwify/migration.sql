/*
  Warnings:

  - You are about to drop the column `abacateCustomerId` on the `barbershops` table. All the data in the column will be lost.
  - You are about to drop the column `abacateSubscriptionId` on the `barbershops` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `barbershops_abacateCustomerId_key` ON `barbershops`;

-- DropIndex
DROP INDEX `barbershops_abacateSubscriptionId_key` ON `barbershops`;

-- AlterTable
ALTER TABLE `barbershops` DROP COLUMN `abacateCustomerId`,
    DROP COLUMN `abacateSubscriptionId`;
