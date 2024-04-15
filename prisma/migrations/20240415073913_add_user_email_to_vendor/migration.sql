/*
  Warnings:

  - A unique constraint covering the columns `[userEmail,name]` on the table `Vendor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `addressLine1` to the `Vendor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userEmail` to the `Vendor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vendor" ADD COLUMN     "addressLine1" TEXT NOT NULL,
ADD COLUMN     "userEmail" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_userEmail_name_key" ON "Vendor"("userEmail", "name");
