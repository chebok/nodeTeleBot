-- CreateTable
CREATE TABLE "UserModel" (
    "id" SERIAL NOT NULL,
    "chat_id" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "authorized" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserModel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserModel_chat_id_key" ON "UserModel"("chat_id");
