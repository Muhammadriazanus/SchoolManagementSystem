/*
  Warnings:

  - You are about to drop the column `endTime` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Lesson` table. All the data in the column will be lost.
  - Added the required column `endtime` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `starttime` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "endTime",
DROP COLUMN "startTime",
ADD COLUMN     "endtime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "starttime" TIMESTAMP(3) NOT NULL;
