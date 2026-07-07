"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RIOT_REGIONS } from "@/lib/constants";

const REGION_LABELS: Record<string, string> = {
  na1: "North America",
  euw1: "EU West",
  eun1: "EU Nordic & East",
  kr: "Korea",
  jp1: "Japan",
  br1: "Brazil",
  la1: "Latin America North",
  la2: "Latin America South",
  sg2: "SEA",
  tr1: "Turkey",
  ru: "Russia",
};

export function SummonerSearchForm() {
  const router = useRouter();
  const [region, setRegion] = useState<string>("na1");
  const [riotId, setRiotId] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const [gameName, tagLine] = riotId.split("#").map((part) => part.trim());
    if (!gameName || !tagLine) {
      setError("Enter your Riot ID as gameName#tagLine, e.g. Endou#1945");
      return;
    }

    setError(null);
    router.push(`/summoner/${region}/${encodeURIComponent(`${gameName}-${tagLine}`)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-xl flex-col gap-2 sm:flex-row">
      <Select value={region} onValueChange={(value) => value && setRegion(value)}>
        <SelectTrigger className="sm:w-44">
          <SelectValue placeholder="Region" />
        </SelectTrigger>
        <SelectContent>
          {RIOT_REGIONS.map((r) => (
            <SelectItem key={r} value={r}>
              {REGION_LABELS[r] ?? r.toUpperCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        value={riotId}
        onChange={(e) => setRiotId(e.target.value)}
        placeholder="gameName#tagLine (e.g. Endou#1945)"
        className="flex-1"
      />

      <Button type="submit">Search</Button>
      {error && <p className="text-sm text-destructive sm:absolute sm:mt-10">{error}</p>}
    </form>
  );
}
