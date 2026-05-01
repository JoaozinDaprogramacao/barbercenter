/*
  Warnings:

  - A unique constraint covering the columns `[abacateCustomerId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `abacateCustomerId` VARCHAR(191) NULL,
    ADD COLUMN `planExpiresAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `planStatus` VARCHAR(191) NOT NULL DEFAULT 'TRIAL';

-- CreateIndex
CREATE UNIQUE INDEX `users_abacateCustomerId_key` ON `users`(`abacateCustomerId`);
