-- AlterTable
ALTER TABLE "User" ADD COLUMN     "favorite_continent" TEXT NOT NULL DEFAULT 'Unknown',
ADD COLUMN     "preferred_temperature" TEXT NOT NULL DEFAULT 'Unknown';
