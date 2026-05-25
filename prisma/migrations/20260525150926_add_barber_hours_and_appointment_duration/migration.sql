-- AlterTable
ALTER TABLE `appointments` ADD COLUMN `duration` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `workingHours` JSON NULL;
