/*
  Warnings:

  - Changed the type of `orderType` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `priceType` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `RedemptionOrder` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `orderType` on the `RedemptionOrder` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('OPEN', 'CLOSE', 'EXECUTED');

-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('SELL', 'BUY');

-- CreateEnum
CREATE TYPE "PriceType" AS ENUM ('MANUAL', 'MARKET');

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "orderType",
ADD COLUMN     "orderType" "OrderType" NOT NULL,
DROP COLUMN "priceType",
ADD COLUMN     "priceType" "PriceType" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL;

-- AlterTable
ALTER TABLE "RedemptionOrder" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL,
DROP COLUMN "orderType",
ADD COLUMN     "orderType" "OrderType" NOT NULL;
