/*
  Warnings:

  - You are about to drop the column `userId` on the `push_subscriptions` table. All the data in the column will be lost.
  - Added the required column `barberId` to the `push_subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `push_subscriptions` DROP FOREIGN KEY `push_subscriptions_userId_fkey`;

-- DropIndex
DROP INDEX `push_subscriptions_userId_fkey` ON `push_subscriptions`;

-- AlterTable
ALTER TABLE `push_subscriptions` DROP COLUMN `userId`,
    ADD COLUMN `barberId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `push_subscriptions_barberId_fkey` ON `push_subscriptions`(`barberId`);

-- AddForeignKey
ALTER TABLE `push_subscriptions` ADD CONSTRAINT `push_subscriptions_barberId_fkey` FOREIGN KEY (`barberId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
