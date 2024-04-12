import {CHARACTER_BLOCKLIST} from './character-blocklist.mjs';
import {UNFAIR_ACHIEVEMENT_POINTS} from './max.mjs';

export const removeUnfairAchievementsHighscoreEntries = (_unfairAchievementsHighscores) => {
	const unfairAchievementsHighscores = structuredClone(_unfairAchievementsHighscores);
	const fairAchievementsHighscores = [];
	let delta = 0;
	for (const entry of unfairAchievementsHighscores) {
		if (CHARACTER_BLOCKLIST.has(entry.name)) {
			delta++;
			continue;
		}
		entry.rank -= delta;
		fairAchievementsHighscores.push(entry);
	}
	return fairAchievementsHighscores;
};

export const adjustUnfairAchievementsHighscoreEntries = (_unfairAchievementsHighscores) => {
	const unfairAchievementsHighscores = structuredClone(_unfairAchievementsHighscores);
	for (const entry of unfairAchievementsHighscores) {
		if (CHARACTER_BLOCKLIST.has(entry.name)) {
			entry.value -= UNFAIR_ACHIEVEMENT_POINTS;
			continue;
		}
	}
	const adjusted = unfairAchievementsHighscores.sort((a, b) => {
		return b.value - a.value;
	});
	let rank = 0;
	let prevPoints = 0;
	for (const entry of adjusted) {
		const points = entry.value;
		if (points !== prevPoints) {
			rank++;
			prevPoints = points;
		}
		entry.rank = rank;
	}
	return adjusted;
};
