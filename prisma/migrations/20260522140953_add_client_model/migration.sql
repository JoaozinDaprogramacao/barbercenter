-- AlterTable
ALTER TABLE `appointments` ADD COLUMN `clientId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `clients` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `barbershopId` VARCHAR(191) NOT NULL,

    INDEX `clients_barbershopId_fkey`(`barbershopId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `appointments_clientId_fkey` ON `appointments`(`clientId`);

-- AddForeignKey
ALTER TABLE `clients` ADD CONSTRAINT `clients_barbershopId_fkey` FOREIGN KEY (`barbershopId`) REFERENCES `barbershops`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
