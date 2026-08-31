-- CreateTable
CREATE TABLE `visitors` (
    `id` VARCHAR(191) NOT NULL,
    `affiliateId` VARCHAR(191) NULL,
    `affiliateCode` VARCHAR(191) NULL,
    `barbershopId` VARCHAR(191) NULL,
    `source` VARCHAR(191) NULL,
    `device` VARCHAR(191) NULL,
    `landingPath` VARCHAR(191) NULL,
    `firstSeenAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastSeenAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `visitors_affiliateId_fkey`(`affiliateId`),
    INDEX `visitors_barbershopId_idx`(`barbershopId`),
    INDEX `visitors_firstSeenAt_idx`(`firstSeenAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `funnel_events` (
    `id` VARCHAR(191) NOT NULL,
    `visitorId` VARCHAR(191) NOT NULL,
    `step` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL DEFAULT '',
    `occurrences` INTEGER NOT NULL DEFAULT 1,
    `affiliateId` VARCHAR(191) NULL,
    `barbershopId` VARCHAR(191) NULL,
    `metadata` JSON NULL,
    `firstAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `funnel_events_step_idx`(`step`),
    INDEX `funnel_events_affiliateId_step_idx`(`affiliateId`, `step`),
    INDEX `funnel_events_barbershopId_idx`(`barbershopId`),
    INDEX `funnel_events_firstAt_idx`(`firstAt`),
    UNIQUE INDEX `funnel_events_visitorId_step_key_key`(`visitorId`, `step`, `key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `visitors` ADD CONSTRAINT `visitors_affiliateId_fkey` FOREIGN KEY (`affiliateId`) REFERENCES `affiliates`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `funnel_events` ADD CONSTRAINT `funnel_events_visitorId_fkey` FOREIGN KEY (`visitorId`) REFERENCES `visitors`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
