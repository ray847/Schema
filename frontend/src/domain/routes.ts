export interface RouteCandidate {
  id: string;
  label: string;
  roomKeys: string[];
  score: number;
}

export function rankRoutes(routes: RouteCandidate[]) {
  return [...routes].sort((left, right) => right.score - left.score);
}
