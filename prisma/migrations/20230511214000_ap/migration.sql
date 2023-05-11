/*
  Warnings:

  - A unique constraint covering the columns `[accessionName]` on the table `apples` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "apples_accessionName_key" ON "apples"("accessionName");
