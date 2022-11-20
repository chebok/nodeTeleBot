/*
  Warnings:

  - You are about to drop the `BindBuyOrderModel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BindSellOrderModel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BuyOrderModel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SellOrderModel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserModel` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BindBuyOrderModel" DROP CONSTRAINT "BindBuyOrderModel_bindOrderId_fkey";

-- DropForeignKey
ALTER TABLE "BindBuyOrderModel" DROP CONSTRAINT "BindBuyOrderModel_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "BindSellOrderModel" DROP CONSTRAINT "BindSellOrderModel_bindOrderId_fkey";

-- DropForeignKey
ALTER TABLE "BindSellOrderModel" DROP CONSTRAINT "BindSellOrderModel_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "BuyOrderModel" DROP CONSTRAINT "BuyOrderModel_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "SellOrderModel" DROP CONSTRAINT "SellOrderModel_ownerId_fkey";

-- DropTable
DROP TABLE "BindBuyOrderModel";

-- DropTable
DROP TABLE "BindSellOrderModel";

-- DropTable
DROP TABLE "BuyOrderModel";

-- DropTable
DROP TABLE "SellOrderModel";

-- DropTable
DROP TABLE "UserModel";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "chat_id" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "authorized" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Currency" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Currency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "orderType" TEXT NOT NULL,
    "sellCurrencyId" INTEGER NOT NULL,
    "buyCurrencyId" INTEGER NOT NULL,
    "count" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "priceType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RedemptionOrder" (
    "id" SERIAL NOT NULL,
    "parentOrderId" INTEGER NOT NULL,
    "count" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "priceType" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "RedemptionOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_chat_id_key" ON "User"("chat_id");

-- CreateIndex
CREATE UNIQUE INDEX "Currency_title_key" ON "Currency"("title");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_sellCurrencyId_fkey" FOREIGN KEY ("sellCurrencyId") REFERENCES "Currency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_buyCurrencyId_fkey" FOREIGN KEY ("buyCurrencyId") REFERENCES "Currency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RedemptionOrder" ADD CONSTRAINT "RedemptionOrder_parentOrderId_fkey" FOREIGN KEY ("parentOrderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RedemptionOrder" ADD CONSTRAINT "RedemptionOrder_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
