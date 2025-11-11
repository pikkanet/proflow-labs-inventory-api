-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('inbound', 'outbound');

-- CreateEnum
CREATE TYPE "StockStatus" AS ENUM ('out_of_stock', 'low_stock', 'in_stock');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Warehouse" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Warehouse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "is_show" BOOLEAN NOT NULL DEFAULT true,
    "qty" INTEGER NOT NULL DEFAULT 0,
    "reserve_qty" INTEGER NOT NULL DEFAULT 0,
    "stock_status" "StockStatus" NOT NULL DEFAULT 'out_of_stock',
    "warehouse_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("sku")
);

-- CreateTable
CREATE TABLE "InventoryMovement" (
    "id" TEXT NOT NULL,
    "activity_type" "ActivityType" NOT NULL,
    "qty" INTEGER NOT NULL,
    "current_qty" INTEGER NOT NULL,
    "note" TEXT,
    "item_id" TEXT NOT NULL,
    "warehouse_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryMovement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
