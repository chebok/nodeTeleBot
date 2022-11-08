-- CreateTable
CREATE TABLE "PostModel" (
    "id" SERIAL NOT NULL,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "PostModel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PostModel" ADD CONSTRAINT "PostModel_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "UserModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
