-- CreateTable
CREATE TABLE "CategoriesOnApples" (
    "appleId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedById" INTEGER NOT NULL,

    CONSTRAINT "CategoriesOnApples_pkey" PRIMARY KEY ("appleId","categoryId")
);

-- AddForeignKey
ALTER TABLE "CategoriesOnApples" ADD CONSTRAINT "CategoriesOnApples_appleId_fkey" FOREIGN KEY ("appleId") REFERENCES "apples"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriesOnApples" ADD CONSTRAINT "CategoriesOnApples_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriesOnApples" ADD CONSTRAINT "CategoriesOnApples_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
