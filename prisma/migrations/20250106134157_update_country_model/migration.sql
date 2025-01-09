/*
  Warnings:

  - You are about to drop the column `continent_id` on the `Country` table. All the data in the column will be lost.
  - You are about to drop the column `temperature_id` on the `Country` table. All the data in the column will be lost.
  - Added the required column `continent` to the `Country` table without a default value. This is not possible if the table is not empty.
  - Added the required column `temperature` to the `Country` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Country" DROP COLUMN "continent_id",
DROP COLUMN "temperature_id",
ADD COLUMN     "continent" "Continent" NOT NULL,
ADD COLUMN     "temperature" "Temperature" NOT NULL;
