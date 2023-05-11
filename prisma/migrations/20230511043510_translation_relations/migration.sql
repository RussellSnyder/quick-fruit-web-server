/*
  Warnings:

  - A unique constraint covering the columns `[appleId]` on the table `appletranslations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `appleId` to the `appletranslations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `translationId` to the `categories` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "appleimages" DROP CONSTRAINT "appleimages_appleId_fkey";

-- AlterTable
ALTER TABLE "appletranslations" ADD COLUMN     "appleId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "translationId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "appletranslations_appleId_key" ON "appletranslations"("appleId");

-- AddForeignKey
ALTER TABLE "appletranslations" ADD CONSTRAINT "appletranslations_appleId_fkey" FOREIGN KEY ("appleId") REFERENCES "apples"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appleimages" ADD CONSTRAINT "appleimages_appleId_fkey" FOREIGN KEY ("appleId") REFERENCES "apples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_translationId_fkey" FOREIGN KEY ("translationId") REFERENCES "categorytranslations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
