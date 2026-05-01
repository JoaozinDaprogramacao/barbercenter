/*
  Warnings:

  - You are about to drop the column `abacateCustomerId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `planExpiresAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `planStatus` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `users_abacateCustomerId_key` ON `users`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `abacateCustomerId`,
    DROP COLUMN `planExpiresAt`,
    DROP COLUMN `planStatus`;
