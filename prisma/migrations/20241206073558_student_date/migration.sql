/*
  Warnings:

  - You are about to drop the column `date` on the `Announcement` table. All the data in the column will be lost.
  - You are about to drop the column `bloodType` on the `Student` table. All the data in the column will be lost.
  - Added the required column `bloodtype` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Announcement" DROP COLUMN "date";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "bloodType",
ADD COLUMN     "bloodtype" TEXT NOT NULL;
