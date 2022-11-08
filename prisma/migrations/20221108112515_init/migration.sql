/*
  Warnings:

  - You are about to drop the `OrderModel` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `UserModel` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OrderModel" DROP CONSTRAINT "OrderModel_ownerId_fkey";

-- AlterTable
ALTER TABLE "UserModel" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "OrderModel";

-- CreateTable
CREATE TABLE "BuyOrderModel" (
    "id" SERIAL NOT NULL,
    "buyCurrency" TEXT NOT NULL,
    "sellCurrency" TEXT NOT NULL,
    "count" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "isExecuted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "BuyOrderModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BindSellOrderModel" (
    "id" SERIAL NOT NULL,
    "bindOrderId" INTEGER NOT NULL,
    "count" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "isExecuted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "BindSellOrderModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SellOrderModel" (
    "id" SERIAL NOT NULL,
    "sellCurrency" TEXT NOT NULL,
    "buyCurrency" TEXT NOT NULL,
    "count" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "isExecuted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SellOrderModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BindBuyOrderModel" (
    "id" SERIAL NOT NULL,
    "bindOrderId" INTEGER NOT NULL,
    "count" DOUBLE PRECISION NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "isExecuted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "BindBuyOrderModel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BuyOrderModel" ADD CONSTRAINT "BuyOrderModel_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "UserModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BindSellOrderModel" ADD CONSTRAINT "BindSellOrderModel_bindOrderId_fkey" FOREIGN KEY ("bindOrderId") REFERENCES "BuyOrderModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BindSellOrderModel" ADD CONSTRAINT "BindSellOrderModel_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "UserModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellOrderModel" ADD CONSTRAINT "SellOrderModel_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "UserModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BindBuyOrderModel" ADD CONSTRAINT "BindBuyOrderModel_bindOrderId_fkey" FOREIGN KEY ("bindOrderId") REFERENCES "SellOrderModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BindBuyOrderModel" ADD CONSTRAINT "BindBuyOrderModel_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "UserModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
