/*
  Warnings:

  - You are about to drop the `PostModel` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PostModel" DROP CONSTRAINT "PostModel_authorId_fkey";

-- DropTable
DROP TABLE "PostModel";

-- CreateTable
CREATE TABLE "OrderModel" (
    "id" SERIAL NOT NULL,
    "sellCurrency" TEXT NOT NULL,
    "buyCurrency" TEXT NOT NULL,
    "count" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "isCryptoSell" BOOLEAN NOT NULL,
    "bindOrder" INTEGER,
    "ownerId" INTEGER NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "OrderModel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrderModel" ADD CONSTRAINT "OrderModel_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "UserModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
