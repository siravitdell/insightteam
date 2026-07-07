"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TeamAnalysisResult } from "@/validation/team-analysis";

export function TeamAnalysisCard({ analysis }: { analysis: TeamAnalysisResult }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>AI Team Analysis</CardTitle>
          <Badge>{Math.round(analysis.synergyScore)} synergy</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{analysis.summary}</p>

          <div>
            <h3 className="text-sm font-medium">Strengths</h3>
            <ul className="mt-1 list-disc pl-5 text-sm text-muted-foreground">
              {analysis.strengths.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium">Weaknesses</h3>
            <ul className="mt-1 list-disc pl-5 text-sm text-muted-foreground">
              {analysis.weaknesses.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium">Recommendations</h3>
            <ul className="mt-1 list-disc pl-5 text-sm text-muted-foreground">
              {analysis.recommendations.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
