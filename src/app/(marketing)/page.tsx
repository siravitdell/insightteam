import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SummonerSearchForm } from "@/components/features/summoner-search-form";

const FEATURES = [
  {
    title: "Best duo partners",
    description: "Find which teammates you win with most, backed by real match data.",
  },
  {
    title: "Champion synergy",
    description: "See which champion combinations create lane and teamfight advantages.",
  },
  {
    title: "AI coaching insights",
    description: "Get a coach-style breakdown of why your team wins or loses, not just stats.",
  },
];

export default function MarketingHomePage() {
  return (
    <main className="flex-1">
      <section className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Your AI League of Legends team coach
        </h1>
        <p className="max-w-2xl text-balance text-lg text-muted-foreground">
          Game Team Analyzer goes beyond stat dashboards — it tells you why you win, why you lose,
          and who you should be playing with.
        </p>
        <SummonerSearchForm />
        <Button render={<Link href="/teams" />} nativeButton={false} variant="outline">
          Analyze a team instead
        </Button>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-6 pb-24 sm:grid-cols-3">
        {FEATURES.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent />
          </Card>
        ))}
      </section>
    </main>
  );
}
