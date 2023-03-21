/*
  Warnings:

  - The `status` column on the `media` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('active', 'inactive');

-- AlterTable
ALTER TABLE "media" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'active';
