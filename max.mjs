// See https://github.com/mathiasbynens/tibia-json/blob/main/data/max.json
// for auto-updated values.

import { computeBossBonuses } from './boss-points-utils.mjs';

// Excluding coinciding achievements.
export const MAX_ACHIEVEMENT_POINTS = 1_394;

export const MAX_CHARM_POINTS = 25_989;

export const MAX_BOSS_POINTS = 26_400;
export const MAX_BOSS_BONUSES = computeBossBonuses(MAX_BOSS_POINTS);

// Characters that rook themselves can unlock a number of coinciding
// achievements, resulting in some additional points. Since this is
// feasible for new characters but not feasible for characters that
// already existed when achievements were introduced, this is considered
// to be unfair overall.
export const UNFAIR_ACHIEVEMENT_POINTS = 34;
export const MAX_ACHIEVEMENT_POINTS_UNFAIR =
	MAX_ACHIEVEMENT_POINTS + UNFAIR_ACHIEVEMENT_POINTS;
