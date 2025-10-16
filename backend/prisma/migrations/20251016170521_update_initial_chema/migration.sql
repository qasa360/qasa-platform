/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Flat` table. All the data in the column will be lost.
  - You are about to drop the `Owner` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Flat" DROP CONSTRAINT "Flat_ownerId_fkey";

-- DropIndex
DROP INDEX "public"."Flat_ownerId_idx";

-- AlterTable
ALTER TABLE "Flat" DROP COLUMN "ownerId";

-- DropTable
DROP TABLE "public"."Owner";
