/*
  Warnings:

  - The `warehouse_id` column on the `InventoryMovement` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `warehouse_id` column on the `Item` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Warehouse` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Warehouse` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "InventoryMovement" DROP COLUMN "warehouse_id",
ADD COLUMN     "warehouse_id" INTEGER;

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "warehouse_id",
ADD COLUMN     "warehouse_id" INTEGER;

-- AlterTable
ALTER TABLE "Warehouse" DROP CONSTRAINT "Warehouse_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Warehouse_pkey" PRIMARY KEY ("id");
