import type { GameEvent } from "../../model/types";
import { SEASON_1_EVENTS } from "./season1";
import { SEASON_2_EVENTS } from "./season2";
import { SEASON_3_EVENTS } from "./season3";
import { SEASON_4_EVENTS } from "./season4";
import { SEASON_5_EVENTS } from "./season5";

export const ALL_EVENTS: readonly GameEvent[] = [
  ...SEASON_1_EVENTS,
  ...SEASON_2_EVENTS,
  ...SEASON_3_EVENTS,
  ...SEASON_4_EVENTS,
  ...SEASON_5_EVENTS,
];

export function eventsOfSeason(season: number): GameEvent[] {
  return ALL_EVENTS.filter((e) => e.season === season);
}
