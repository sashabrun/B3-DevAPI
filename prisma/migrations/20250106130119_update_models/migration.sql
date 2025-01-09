/*
  Warnings:

  - A unique constraint covering the columns `[user1_id,user2_id]` on the table `Couple` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `Visit` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[country_id]` on the table `Visit` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `continent_id` on the `Country` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `temperature_id` on the `Country` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `favorite_continent` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `preferred_temperature` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Continent" AS ENUM ('Africa', 'Antarctica', 'Asia', 'Europe', 'North_America', 'Oceania', 'South_America');

-- CreateEnum
CREATE TYPE "Temperature" AS ENUM ('Cold', 'Hot', 'Mild');

-- AlterTable
ALTER TABLE "Country" DROP COLUMN "continent_id",
ADD COLUMN     "continent_id" "Continent" NOT NULL,
DROP COLUMN "temperature_id",
ADD COLUMN     "temperature_id" "Temperature" NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "favorite_continent",
ADD COLUMN     "favorite_continent" "Continent" NOT NULL,
DROP COLUMN "preferred_temperature",
ADD COLUMN     "preferred_temperature" "Temperature" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Couple_user1_id_user2_id_key" ON "Couple"("user1_id", "user2_id");

-- CreateIndex
CREATE UNIQUE INDEX "Visit_user_id_key" ON "Visit"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Visit_country_id_key" ON "Visit"("country_id");

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Couple" ADD CONSTRAINT "Couple_user1_id_fkey" FOREIGN KEY ("user1_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Couple" ADD CONSTRAINT "Couple_user2_id_fkey" FOREIGN KEY ("user2_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
