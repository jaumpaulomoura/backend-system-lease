-- CreateTable
CREATE TABLE `products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `categoria` VARCHAR(63) NOT NULL,
    `marca` VARCHAR(63) NOT NULL,
    `description` TEXT NULL,
    `daily_value` DECIMAL(10, 2) NOT NULL,
    `weekly_value` DECIMAL(10, 2) NOT NULL,
    `monthly_value` DECIMAL(10, 2) NOT NULL,
    `annual_value` DECIMAL(10, 2) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
