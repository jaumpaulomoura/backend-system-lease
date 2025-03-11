-- CreateTable
CREATE TABLE `stock` (
    `id_patrimonio` INTEGER NOT NULL AUTO_INCREMENT,
    `id_produto` INTEGER NOT NULL,
    `numero_patrimonio` VARCHAR(255) NOT NULL,
    `nota_fiscal` TEXT NULL,
    `valor_pago` DECIMAL(10, 2) NOT NULL,
    `status` VARCHAR(50) NOT NULL,
    `observacoes` TEXT NULL,

    PRIMARY KEY (`id_patrimonio`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `stock` ADD CONSTRAINT `stock_id_produto_fkey` FOREIGN KEY (`id_produto`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
