/*
  Warnings:

  - A unique constraint covering the columns `[abacateCustomerId]` on the table `barbershops` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[abacateSubscriptionId]` on the table `barbershops` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `barbershops` ADD COLUMN `abacateCustomerId` VARCHAR(191) NULL,
    ADD COLUMN `abacateSubscriptionId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `barbershops_abacateCustomerId_key` ON `barbershops`(`abacateCustomerId`);

-- CreateIndex
CREATE UNIQUE INDEX `barbershops_abacateSubscriptionId_key` ON `barbershops`(`abacateSubscriptionId`);
