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
	'Rei Davi Benyishai',
	'Vinicius Shocks',
]);

export const correctUnfairAchievementsHighscores = (_unfairAchievementsHighscores) => {
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
