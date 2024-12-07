/*
  Warnings:

  - You are about to drop the column `bloodType` on the `Teacher` table. All the data in the column will be lost.
  - Added the required column `bloodtype` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "bloodType",
ADD COLUMN     "bloodtype" TEXT NOT NULL;
