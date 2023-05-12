/*
  Warnings:

  - You are about to drop the column `pickingTimeText` on the `appletranslations` table. All the data in the column will be lost.
  - Added the required column `updatedById` to the `apples` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "apples" ADD COLUMN     "updatedById" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "appletranslations" DROP COLUMN "pickingTimeText",
ADD COLUMN     "pickingTime" TEXT;

-- AddForeignKey
ALTER TABLE "apples" ADD CONSTRAINT "apples_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
