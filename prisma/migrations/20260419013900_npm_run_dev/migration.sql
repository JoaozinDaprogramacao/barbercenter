-- AlterTable
ALTER TABLE `appointments` ADD COLUMN `barberId` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `appointments_barberId_fkey` ON `appointments`(`barberId`);

-- AddForeignKey
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_barberId_fkey` FOREIGN KEY (`barberId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
