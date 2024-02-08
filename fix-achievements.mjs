// Characters confirmed to have been rooked in order to obtain coinciding
// achievements that are otherwise impossible to get.
export const CHARACTER_BLOCKLIST = new Set([
	'Annie Arelluf',
	'Elyrea',
	'Firdeso',
	'Garoto Do Sorriso',
	'Horon Aoldas',
	'Inge Naning',
	'Kapunia',
	'Lord Strikee',
	'Marcus Eon',
	'Niix Insanity',
	'Rei Davi Benyishai',
	'Vinicius Shocks',
]);

// Characters that rook themselves can unlock a number of coinciding
// achievements, resulting in some additional points. Since this is
// feasible for new characters but not feasible for characters that
// already existed when achievements were introduced, this is considered
// to be unfair overall.
export const UNFAIR_ACHIEVEMENT_POINTS = 45;

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
