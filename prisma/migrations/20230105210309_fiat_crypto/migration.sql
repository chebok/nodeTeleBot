/*
  Warnings:

  - You are about to drop the column `buyCurrencyId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `sellCurrencyId` on the `Order` table. All the data in the column will be lost.
  - Added the required column `cryptoCurrencyId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fiatCurrencyId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_buyCurrencyId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_sellCurrencyId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "buyCurrencyId",
DROP COLUMN "sellCurrencyId",
ADD COLUMN     "cryptoCurrencyId" INTEGER NOT NULL,
ADD COLUMN     "fiatCurrencyId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_fiatCurrencyId_fkey" FOREIGN KEY ("fiatCurrencyId") REFERENCES "Currency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_cryptoCurrencyId_fkey" FOREIGN KEY ("cryptoCurrencyId") REFERENCES "Currency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
