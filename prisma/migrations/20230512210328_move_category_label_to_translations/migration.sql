/*
  Warnings:

  - You are about to drop the column `label` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `translationId` on the `categories` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `categorytranslations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_translationId_fkey";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "label",
DROP COLUMN "translationId";

-- AlterTable
ALTER TABLE "categorytranslations" ADD COLUMN     "categoryId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "categorytranslations" ADD CONSTRAINT "categorytranslations_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
