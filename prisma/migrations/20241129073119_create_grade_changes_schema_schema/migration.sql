-- CreateTable
CREATE TABLE "Grade" (
    "id" SERIAL NOT NULL,
    "level" INTEGER NOT NULL,
    "students" TEXT[],
    "classess" TEXT[],

    CONSTRAINT "Grade_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Grade_level_key" ON "Grade"("level");
