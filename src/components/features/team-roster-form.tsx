"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RIOT_REGIONS } from "@/lib/constants";
import type { RiotRegion } from "@/lib/constants";

const REGION_LABELS: Record<string, string> = {
  sg2: "SEA",
  na1: "North America",
  euw1: "EU West",
  eun1: "EU Nordic & East",
  kr: "Korea",
  jp1: "Japan",
  br1: "Brazil",
  la1: "Latin America North",
  la2: "Latin America South",
  tr1: "Turkey",
  ru: "Russia",
};

const MIN_PLAYERS = 2;
const MAX_PLAYERS = 5;

export function TeamRosterForm({
  onSubmit,
}: {
  onSubmit: (region: RiotRegion, riotIds: string[]) => void;
}) {
  const [region, setRegion] = useState<string>("sg2");
  const [riotIds, setRiotIds] = useState<string[]>(["", ""]);
  const [error, setError] = useState<string | null>(null);

  function updateRiotId(index: number, value: string) {
    setRiotIds((prev) => prev.map((id, i) => (i === index ? value : id)));
  }

  function addPlayer() {
    if (riotIds.length >= MAX_PLAYERS) return;
    setRiotIds((prev) => [...prev, ""]);
  }

  function useFullTeam() {
    setRiotIds((prev) => {
      const next = [...prev];
      while (next.length < MAX_PLAYERS) next.push("");
      return next;
    });
  }

  function removePlayer(index: number) {
    if (riotIds.length <= MIN_PLAYERS) return;
    setRiotIds((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmed = riotIds.map((id) => id.trim()).filter(Boolean);
    if (trimmed.length < MIN_PLAYERS) {
      setError(`Enter at least ${MIN_PLAYERS} Riot IDs`);
      return;
    }
    if (trimmed.some((id) => !id.includes("#"))) {
      setError("Each Riot ID must be in gameName#tagLine format, e.g. Endou#1945");
      return;
    }

    setError(null);
    onSubmit(region as RiotRegion, trimmed);
  }

  return (
    <Card className="max-w-2xl">
      <CardContent className="p-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Region
            </label>
            <Select value={region} onValueChange={(value) => value && setRegion(value)}>
              <SelectTrigger className="w-44">
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
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Players ({riotIds.length}/{MAX_PLAYERS})
            </label>
            <div className="space-y-2">
              {riotIds.map((riotId, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={riotId}
                    onChange={(e) => updateRiotId(index, e.target.value)}
                    placeholder={`Player ${index + 1}: gameName#tagLine`}
                    className="flex-1"
                  />
                  {riotIds.length > MIN_PLAYERS && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removePlayer(index)}
                      aria-label={`Remove player ${index + 1}`}
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {riotIds.length < MAX_PLAYERS && (
              <Button type="button" variant="outline" size="sm" onClick={addPlayer}>
                + Add player
              </Button>
            )}
            {riotIds.length < MAX_PLAYERS && (
              <Button type="button" variant="outline" size="sm" onClick={useFullTeam}>
                Full team (5)
              </Button>
            )}
            <Button type="submit" className="ml-auto">
              Analyze team
            </Button>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </form>
      </CardContent>
    </Card>
  );
}
