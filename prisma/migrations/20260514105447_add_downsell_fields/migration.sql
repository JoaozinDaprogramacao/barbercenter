-- AlterTable
ALTER TABLE `upsell_rules` ADD COLUMN `downsellCustomCopy` VARCHAR(191) NULL,
    ADD COLUMN `downsellDiscountAmount` DOUBLE NULL,
    ADD COLUMN `downsellOfferProductId` VARCHAR(191) NULL,
    ADD COLUMN `downsellOfferServiceId` VARCHAR(191) NULL,
    ADD COLUMN `hasDownsell` BOOLEAN NOT NULL DEFAULT false;
