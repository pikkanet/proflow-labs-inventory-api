/*
  Warnings:

  - You are about to drop the column `item_id` on the `InventoryMovement` table. All the data in the column will be lost.
  - Added the required column `sku` to the `InventoryMovement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InventoryMovement" DROP COLUMN "item_id",
ADD COLUMN     "sku" TEXT NOT NULL;
