/*
  Warnings:

  - You are about to drop the column `floor` on the `space` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "space" DROP COLUMN "floor";

-- CreateTable
CREATE TABLE "ElementCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ElementCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "element_type" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "element_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "element" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "space_id" INTEGER NOT NULL,
    "element_type_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "model" TEXT,
    "material" TEXT,
    "color" TEXT,
    "condition" TEXT,
    "notes" JSONB,
    "dimensions" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "element_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "element_uuid_key" ON "element"("uuid");

-- AddForeignKey
ALTER TABLE "element_type" ADD CONSTRAINT "element_type_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "ElementCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "element" ADD CONSTRAINT "element_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "element" ADD CONSTRAINT "element_element_type_id_fkey" FOREIGN KEY ("element_type_id") REFERENCES "element_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
