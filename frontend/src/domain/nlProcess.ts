export interface ParsedPlanningQuery {
  rawText: string;
  inferredIntent: 'planning' | 'preference' | 'unknown';
  entities: string[];
}

export function parsePlanningQuery(rawText: string): ParsedPlanningQuery {
  return {
    rawText,
    inferredIntent: rawText.trim() ? 'planning' : 'unknown',
    entities: [],
  };
}
