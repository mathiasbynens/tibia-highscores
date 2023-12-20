const map = new Map([
	['achievements-filtered', {
		name: 'achievements (filtered)',
		description: 'Achievement highscores with “unfair” entries (involving coinciding achievements due to rooking characters) removed.',
	}],
	['achievements-unfair', {
		name: 'achievements (unfair)',
		description: 'Achievement highscores including “unfair” entries (involving coinciding achievements due to rooking characters). Characters created before the introduction of achievements are unfairly disadvantaged in these rankings.',
	}],
	['achievements', {
		name: 'achievements (adjusted)',
		description: 'Achievement highscores with “unfair” entries (involving coinciding achievements due to rooking characters) adjusted by deducting those points.',
	}],
	['axe-fighting', {
		name: 'axe fighting',
		description: '',
	}],
	['boss-points', {
		name: 'boss points',
		description: '',
	}],
	['charm-points', {
		name: 'charm points',
		description: '',
	}],
	['club-fighting', {
		name: 'club fighting',
		description: '',
	}],
	['completionists', {
		name: 'completionists',
		description: 'Completionists are players who seek to complete all possible tasks in Tibia. We measure the completeness of a character by seeing how many achievement points, charm points, and boss points it has, based on the maximum amount of these points that can be obtained in the game.',
	}],
	['distance-fighting', {
		name: 'distance fighting',
		description: '',
	}],
	['drome-score', {
		name: 'Tibiadrome scores',
		description: 'During each Tibiadrome rotation (lasting two weeks), a character gets a score equal to the greatest wave level it completes. The total of these scores across the character’s lifetime is represented in these highscores.',
	}],
	['experience-druids', {
		name: 'experience (druids)',
		description: '',
	}],
	['experience-knights', {
		name: 'experience (knights)',
		description: '',
	}],
	['experience-paladins', {
		name: 'experience (paladins)',
		description: '',
	}],
	['experience-sorcerers', {
		name: 'experience (sorcerers)',
		description: '',
	}],
	['experience', {
		name: 'experience (all vocations)',
		description: '',
	}],
	['fishing', {
		name: 'fishing',
		description: '',
	}],
	['fist-fighting', {
		name: 'fist fighting',
		description: '',
	}],
	['goshnars-taint', {
		name: 'Goshnar’s Taint',
		description: 'The Goshnar’s Taint highscores are related to killing the bosses in the Soul War quest. Killing a mini-boss yields 1 point, and killing the final boss yields 10 points.',
	}],
	['loyalty-points', {
		name: 'loyalty points',
		description: '',
	}],
	['magic-level-druids', {
		name: 'magic level (druids)',
		description: '',
	}],
	['magic-level-knights', {
		name: 'magic level (knights)',
		description: '',
	}],
	['magic-level-paladins', {
		name: 'magic level (paladins)',
		description: '',
	}],
	['magic-level-sorcerers', {
		name: 'magic level (sorcerers)',
		description: '',
	}],
	['magic-level', {
		name: 'magic level (all vocations)',
		description: '',
	}],
	['shielding-druids', {
		name: 'shielding (druids)',
		description: '',
	}],
	['shielding-knights', {
		name: 'shielding (knights)',
		description: '',
	}],
	['shielding-paladins', {
		name: 'shielding (paladins)',
		description: '',
	}],
	['shielding-sorcerers', {
		name: 'shielding (sorcerers)',
		description: '',
	}],
	['shielding', {
		name: 'shielding (all vocations)',
		description: '',
	}],
	['sword-fighting', {
		name: 'sword fighting',
		description: '',
	}],
]);

export const getCategoryMetaData = (id) => {
	return map.get(id);
};
