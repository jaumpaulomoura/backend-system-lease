-- AlterTable
ALTER TABLE `lease` ADD COLUMN `valor_multa` DECIMAL(10, 2) NULL;

-- AddForeignKey
ALTER TABLE `lease` ADD CONSTRAINT `lease_cliente_id_fkey` FOREIGN KEY (`cliente_id`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

