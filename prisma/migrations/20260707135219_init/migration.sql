-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "summoners" (
    "id" TEXT NOT NULL,
    "puuid" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "game_name" TEXT NOT NULL,
    "tag_line" TEXT NOT NULL,
    "summoner_level" INTEGER NOT NULL,
    "profile_icon_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT,

    CONSTRAINT "summoners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matches" (
    "id" TEXT NOT NULL,
    "match_id" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "queue_id" INTEGER NOT NULL,
    "game_creation" TIMESTAMP(3) NOT NULL,
    "game_duration" INTEGER NOT NULL,
    "game_version" TEXT NOT NULL,
    "raw_payload" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participants" (
    "id" TEXT NOT NULL,
    "puuid" TEXT NOT NULL,
    "summoner_id" TEXT,
    "champion_id" INTEGER NOT NULL,
    "champion_name" TEXT NOT NULL,
    "team_id" INTEGER NOT NULL,
    "win" BOOLEAN NOT NULL,
    "kills" INTEGER NOT NULL,
    "deaths" INTEGER NOT NULL,
    "assists" INTEGER NOT NULL,
    "cs" INTEGER NOT NULL,
    "gold_earned" INTEGER NOT NULL,
    "damage_dealt" INTEGER NOT NULL,
    "vision_score" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "lane" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "match_id" TEXT NOT NULL,

    CONSTRAINT "participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "champion_stats" (
    "id" TEXT NOT NULL,
    "puuid" TEXT NOT NULL,
    "champion_id" INTEGER NOT NULL,
    "champion_name" TEXT NOT NULL,
    "games" INTEGER NOT NULL DEFAULT 0,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "avg_kda" DOUBLE PRECISION NOT NULL,
    "avg_cs" DOUBLE PRECISION NOT NULL,
    "avg_vision" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "champion_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_analyses" (
    "id" TEXT NOT NULL,
    "roster_hash" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "strengths" JSONB NOT NULL,
    "weaknesses" JSONB NOT NULL,
    "synergy_score" DOUBLE PRECISION NOT NULL,
    "recommendations" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "summoner_id" TEXT,

    CONSTRAINT "team_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "summoners_puuid_key" ON "summoners"("puuid");

-- CreateIndex
CREATE INDEX "summoners_user_id_idx" ON "summoners"("user_id");

-- CreateIndex
CREATE INDEX "summoners_region_game_name_tag_line_idx" ON "summoners"("region", "game_name", "tag_line");

-- CreateIndex
CREATE UNIQUE INDEX "matches_match_id_key" ON "matches"("match_id");

-- CreateIndex
CREATE INDEX "matches_region_game_creation_idx" ON "matches"("region", "game_creation");

-- CreateIndex
CREATE INDEX "participants_match_id_idx" ON "participants"("match_id");

-- CreateIndex
CREATE INDEX "participants_summoner_id_idx" ON "participants"("summoner_id");

-- CreateIndex
CREATE INDEX "participants_puuid_idx" ON "participants"("puuid");

-- CreateIndex
CREATE INDEX "champion_stats_puuid_idx" ON "champion_stats"("puuid");

-- CreateIndex
CREATE UNIQUE INDEX "champion_stats_puuid_champion_id_key" ON "champion_stats"("puuid", "champion_id");

-- CreateIndex
CREATE UNIQUE INDEX "team_analyses_roster_hash_key" ON "team_analyses"("roster_hash");

-- CreateIndex
CREATE INDEX "team_analyses_summoner_id_idx" ON "team_analyses"("summoner_id");

-- AddForeignKey
ALTER TABLE "summoners" ADD CONSTRAINT "summoners_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_summoner_id_fkey" FOREIGN KEY ("summoner_id") REFERENCES "summoners"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_analyses" ADD CONSTRAINT "team_analyses_summoner_id_fkey" FOREIGN KEY ("summoner_id") REFERENCES "summoners"("id") ON DELETE SET NULL ON UPDATE CASCADE;
