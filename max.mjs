// See https://github.com/mathiasbynens/tibia-json/blob/main/data/max.mjs
// for auto-updated values.

export const MAX_ACHIEVEMENT_POINTS = 1_337;

export const MAX_CHARM_POINTS = 25_189;

export const MAX_BOSS_POINTS = 25_450;

// Characters that rook themselves can unlock a number of coinciding
// achievements, resulting in some additional points. Since this is
// feasible for new characters but not feasible for characters that
// already existed when achievements were introduced, this is considered
// to be unfair overall.
export const UNFAIR_ACHIEVEMENT_POINTS = 45;
export const MAX_ACHIEVEMENT_POINTS_UNFAIR = MAX_ACHIEVEMENT_POINTS + UNFAIR_ACHIEVEMENT_POINTS;
