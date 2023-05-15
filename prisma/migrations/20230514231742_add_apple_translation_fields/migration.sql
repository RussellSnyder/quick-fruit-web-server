/*
  Warnings:

  - You are about to drop the column `pickingTime` on the `apples` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "apples" DROP COLUMN "pickingTime";

-- AlterTable
ALTER TABLE "appletranslations" ADD COLUMN     "coarseness" TEXT,
ADD COLUMN     "crown" TEXT,
ADD COLUMN     "crownTree2" TEXT,
ADD COLUMN     "crunch" TEXT,
ADD COLUMN     "fleshColour" TEXT,
ADD COLUMN     "floweringTimeTree1" TEXT,
ADD COLUMN     "greasiness" TEXT,
ADD COLUMN     "groundColour" TEXT,
ADD COLUMN     "groundColourTree2" TEXT,
ADD COLUMN     "height" TEXT,
ADD COLUMN     "heightTree2" TEXT,
ADD COLUMN     "juiciness" TEXT,
ADD COLUMN     "juicinessTree2" TEXT,
ADD COLUMN     "overColour" TEXT,
ADD COLUMN     "overColourAmount" TEXT,
ADD COLUMN     "overColourPattern" TEXT,
ADD COLUMN     "overColourPatternTree2" TEXT,
ADD COLUMN     "overColourTree2" TEXT,
ADD COLUMN     "pickingTimeTree1" TEXT,
ADD COLUMN     "ribbing" TEXT,
ADD COLUMN     "ribbingTree2" TEXT,
ADD COLUMN     "russet" TEXT,
ADD COLUMN     "russetTree2" TEXT,
ADD COLUMN     "shape" TEXT,
ADD COLUMN     "shapeTree2" TEXT,
ADD COLUMN     "size" TEXT,
ADD COLUMN     "sizeTree2" TEXT,
ADD COLUMN     "width" TEXT,
ADD COLUMN     "widthTree2" TEXT;
