/*
  Warnings:

  - You are about to drop the column `trialExpiresAt` on the `barbershops` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[abacateCustomerId]` on the table `barbershops` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[abacateSubscriptionId]` on the table `barbershops` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `barbershops` DROP COLUMN `trialExpiresAt`,
    ADD COLUMN `abacateCustomerId` VARCHAR(191) NULL,
    ADD COLUMN `abacateSubscriptionId` VARCHAR(191) NULL,
    ADD COLUMN `planExpiresAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX `barbershops_abacateCustomerId_key` ON `barbershops`(`abacateCustomerId`);

-- CreateIndex
CREATE UNIQUE INDEX `barbershops_abacateSubscriptionId_key` ON `barbershops`(`abacateSubscriptionId`);
