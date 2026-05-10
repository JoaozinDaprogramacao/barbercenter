-- AlterTable
ALTER TABLE `appointments` ADD COLUMN `discount` DOUBLE NULL DEFAULT 0,
    ADD COLUMN `totalPrice` DOUBLE NULL;

-- CreateTable
CREATE TABLE `products` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `stock` INTEGER NOT NULL DEFAULT 0,
    `barbershopId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `products_barbershopId_fkey`(`barbershopId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `upsell_rules` (
    `id` VARCHAR(191) NOT NULL,
    `barbershopId` VARCHAR(191) NOT NULL,
    `triggerServiceId` VARCHAR(191) NOT NULL,
    `offerServiceId` VARCHAR(191) NULL,
    `offerProductId` VARCHAR(191) NULL,
    `discountAmount` DOUBLE NOT NULL,
    `discountType` VARCHAR(191) NOT NULL DEFAULT 'PERCENTAGE',
    `customCopy` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `upsellrules_barbershopId_fkey`(`barbershopId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_AppointmentProducts` (
    `A` INTEGER NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_AppointmentProducts_AB_unique`(`A`, `B`),
    INDEX `_AppointmentProducts_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_barbershopId_fkey` FOREIGN KEY (`barbershopId`) REFERENCES `barbershops`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `upsell_rules` ADD CONSTRAINT `upsell_rules_barbershopId_fkey` FOREIGN KEY (`barbershopId`) REFERENCES `barbershops`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AppointmentProducts` ADD CONSTRAINT `_AppointmentProducts_A_fkey` FOREIGN KEY (`A`) REFERENCES `appointments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AppointmentProducts` ADD CONSTRAINT `_AppointmentProducts_B_fkey` FOREIGN KEY (`B`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
