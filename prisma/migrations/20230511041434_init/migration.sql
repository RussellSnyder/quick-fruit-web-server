-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'TRANSLATOR_EN', 'TRANSLATOR_DE');

-- CreateEnum
CREATE TYPE "LanguageCode" AS ENUM ('EN', 'DE');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apples" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "accessionName" TEXT NOT NULL,
    "dataUrl" TEXT NOT NULL,
    "genus" TEXT,
    "startFlowering" TIMESTAMP(3),
    "fullFlowering" TIMESTAMP(3),
    "petalFall" TIMESTAMP(3),
    "pickingTime" TIMESTAMP(3),

    CONSTRAINT "apples_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appletranslations" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" INTEGER NOT NULL,
    "languageCode" "LanguageCode" NOT NULL,
    "description" TEXT,
    "pickingTimeText" TEXT,

    CONSTRAINT "appletranslations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appleimages" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "src" TEXT NOT NULL,
    "appleId" INTEGER NOT NULL,

    CONSTRAINT "appleimages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorytranslations" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" INTEGER NOT NULL,
    "languageCode" "LanguageCode" NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "categorytranslations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "appletranslations" ADD CONSTRAINT "appletranslations_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appleimages" ADD CONSTRAINT "appleimages_appleId_fkey" FOREIGN KEY ("appleId") REFERENCES "apples"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categorytranslations" ADD CONSTRAINT "categorytranslations_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
