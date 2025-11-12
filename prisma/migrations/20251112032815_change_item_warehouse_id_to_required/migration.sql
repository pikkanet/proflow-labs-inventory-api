/*
  Warnings:

  - Made the column `warehouse_id` on table `Item` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "warehouse_id" SET NOT NULL;
