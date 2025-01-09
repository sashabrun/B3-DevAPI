-- CreateTable
CREATE TABLE "Visit" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "country_id" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,

    CONSTRAINT "Visit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Couple" (
    "id" SERIAL NOT NULL,
    "user1_id" INTEGER NOT NULL,
    "user2_id" INTEGER NOT NULL,

    CONSTRAINT "Couple_pkey" PRIMARY KEY ("id")
);
