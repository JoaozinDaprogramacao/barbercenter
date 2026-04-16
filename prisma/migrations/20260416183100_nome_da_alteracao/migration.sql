/*
  Warnings:

  - You are about to drop the column `serviceId` on the `appointments` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `appointments` DROP FOREIGN KEY `appointments_serviceId_fkey`;

-- DropIndex
DROP INDEX `appointments_serviceId_fkey` ON `appointments`;

-- AlterTable
ALTER TABLE `appointments` DROP COLUMN `serviceId`;

-- CreateTable
CREATE TABLE `_AppointmentServices` (
    `A` INTEGER NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_AppointmentServices_AB_unique`(`A`, `B`),
    INDEX `_AppointmentServices_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_AppointmentServices` ADD CONSTRAINT `_AppointmentServices_A_fkey` FOREIGN KEY (`A`) REFERENCES `appointments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AppointmentServices` ADD CONSTRAINT `_AppointmentServices_B_fkey` FOREIGN KEY (`B`) REFERENCES `services`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
