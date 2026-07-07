import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Summoner } from "@/validation/summoner";

export function SummonerHeader({ summoner }: { summoner: Summoner }) {
  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-16 w-16">
        <AvatarImage
          src={`https://ddragon.leagueoflegends.com/cdn/img/profileicon/${summoner.profileIconId}.png`}
          alt={summoner.gameName}
        />
        <AvatarFallback>{summoner.gameName.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-2xl font-semibold">
          {summoner.gameName}
          <span className="text-muted-foreground">#{summoner.tagLine}</span>
        </h1>
        <div className="mt-1 flex gap-2">
          <Badge variant="secondary">Level {summoner.summonerLevel}</Badge>
          <Badge variant="outline">{summoner.region.toUpperCase()}</Badge>
        </div>
      </div>
    </div>
  );
}
