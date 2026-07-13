// See https://github.com/mathiasbynens/tibia-json/blob/main/data/max.json
// for auto-updated values.

import { computeBossBonuses } from './boss-points-utils.mjs';

// Excluding coinciding achievements.
export const MAX_ACHIEVEMENT_POINTS = 1_435;

export const MAX_REGULAR_CHARM_POINTS = 28_734;
export const MAX_ECHO_WARDEN_CHARM_POINTS = 9_290;
export const MAX_CHARM_POINTS = 38_024;

export const MAX_BOSS_POINTS = 27_450;
export const MAX_BOSS_BONUSES = computeBossBonuses(MAX_BOSS_POINTS);

// Prior to the Newhaven update [1], characters could rook themselves
// and unlock a number of coinciding achievements, resulting in some
// additional points. Since this was feasible for new characters but
// not feasible for characters that already existed when achievements
// were introduced, and also because rooking is no longer possible
// since [1], this is considered to be unfair overall.
//
// [1]: https://tibia.fandom.com/wiki/Updates/15.12.c7d92c
export const UNFAIR_ACHIEVEMENT_POINTS = 40;
export const MAX_ACHIEVEMENT_POINTS_UNFAIR =
	MAX_ACHIEVEMENT_POINTS + UNFAIR_ACHIEVEMENT_POINTS;
