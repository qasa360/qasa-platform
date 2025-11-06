/*
  Warnings:

  - You are about to drop the column `createdAt` on the `apartment` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `apartment` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SpaceType" AS ENUM ('LIVING_ROOM', 'BEDROOM', 'KITCHEN', 'BATHROOM', 'BALCONY', 'OTHER');

-- AlterTable
ALTER TABLE "apartment" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "space" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "apartment_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "space_type" "SpaceType" NOT NULL,
    "m2" DOUBLE PRECISION,
    "order" INTEGER,
    "floor" INTEGER,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "space_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "space_uuid_key" ON "space"("uuid");

-- AddForeignKey
ALTER TABLE "space" ADD CONSTRAINT "space_apartment_id_fkey" FOREIGN KEY ("apartment_id") REFERENCES "apartment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
