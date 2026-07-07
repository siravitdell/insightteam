import { openai } from "@ai-sdk/openai";
import { generateObject, streamText } from "ai";
import { teamAnalysisResultSchema, type TeamAnalysisResult } from "@/validation/team-analysis";
import { teamSynergyPromptV1, type TeamSynergyPromptContext } from "./prompts/team-synergy-prompt";
import { AiGenerationError } from "@/lib/errors";

const model = openai("gpt-4o");

export async function generateTeamSynergyAnalysis(
  context: TeamSynergyPromptContext
): Promise<TeamAnalysisResult> {
  try {
    const { object } = await generateObject({
      model,
      schema: teamAnalysisResultSchema,
      system: teamSynergyPromptV1.system,
      prompt: teamSynergyPromptV1.buildUserPrompt(context),
    });
    return object;
  } catch (error) {
    throw new AiGenerationError(
      error instanceof Error ? error.message : "Failed to generate team synergy analysis"
    );
  }
}

export function streamTeamSynergyAnalysis(context: TeamSynergyPromptContext) {
  return streamText({
    model,
    system: teamSynergyPromptV1.system,
    prompt: teamSynergyPromptV1.buildUserPrompt(context),
  });
}
