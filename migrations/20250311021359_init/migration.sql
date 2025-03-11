/*
  Warnings:

  - You are about to drop the column `enderecoId` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `endereco_cobrancaId` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `endereco_locacaoId` on the `client` table. All the data in the column will be lost.
  - You are about to drop the `endereco` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `bairro` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bairro_cobranca` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bairro_locacao` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cep` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cep_cobranca` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cep_locacao` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cidade` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cidade_cobranca` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cidade_locacao` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estado` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estado_cobranca` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estado_locacao` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numero` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numero_cobranca` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numero_locacao` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rua` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rua_cobranca` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rua_locacao` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `client` DROP FOREIGN KEY `Client_enderecoId_fkey`;

-- DropForeignKey
ALTER TABLE `client` DROP FOREIGN KEY `Client_endereco_cobrancaId_fkey`;

-- DropForeignKey
ALTER TABLE `client` DROP FOREIGN KEY `Client_endereco_locacaoId_fkey`;

-- DropIndex
DROP INDEX `Client_enderecoId_fkey` ON `client`;

-- DropIndex
DROP INDEX `Client_endereco_cobrancaId_fkey` ON `client`;

-- DropIndex
DROP INDEX `Client_endereco_locacaoId_fkey` ON `client`;

-- AlterTable
ALTER TABLE `client` DROP COLUMN `enderecoId`,
    DROP COLUMN `endereco_cobrancaId`,
    DROP COLUMN `endereco_locacaoId`,
    ADD COLUMN `bairro` VARCHAR(191) NOT NULL,
    ADD COLUMN `bairro_cobranca` VARCHAR(191) NOT NULL,
    ADD COLUMN `bairro_locacao` VARCHAR(191) NOT NULL,
    ADD COLUMN `cep` VARCHAR(191) NOT NULL,
    ADD COLUMN `cep_cobranca` VARCHAR(191) NOT NULL,
    ADD COLUMN `cep_locacao` VARCHAR(191) NOT NULL,
    ADD COLUMN `cidade` VARCHAR(191) NOT NULL,
    ADD COLUMN `cidade_cobranca` VARCHAR(191) NOT NULL,
    ADD COLUMN `cidade_locacao` VARCHAR(191) NOT NULL,
    ADD COLUMN `complemento` VARCHAR(191) NULL,
    ADD COLUMN `complemento_cobranca` VARCHAR(191) NULL,
    ADD COLUMN `complemento_locacao` VARCHAR(191) NULL,
    ADD COLUMN `estado` VARCHAR(191) NOT NULL,
    ADD COLUMN `estado_cobranca` VARCHAR(191) NOT NULL,
    ADD COLUMN `estado_locacao` VARCHAR(191) NOT NULL,
    ADD COLUMN `numero` VARCHAR(191) NOT NULL,
    ADD COLUMN `numero_cobranca` VARCHAR(191) NOT NULL,
    ADD COLUMN `numero_locacao` VARCHAR(191) NOT NULL,
    ADD COLUMN `rua` VARCHAR(191) NOT NULL,
    ADD COLUMN `rua_cobranca` VARCHAR(191) NOT NULL,
    ADD COLUMN `rua_locacao` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `endereco`;
