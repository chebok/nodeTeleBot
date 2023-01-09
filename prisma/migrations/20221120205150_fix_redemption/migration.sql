/*
  Warnings:

  - You are about to drop the column `priceType` on the `RedemptionOrder` table. All the data in the column will be lost.
  - Added the required column `orderType` to the `RedemptionOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RedemptionOrder" DROP COLUMN "priceType",
ADD COLUMN     "orderType" TEXT NOT NULL;
