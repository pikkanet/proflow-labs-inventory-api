-- DropIndex
DROP INDEX "Item_name_key";

-- AlterTable
ALTER TABLE "InventoryMovement" ADD COLUMN     "created_by" TEXT;
