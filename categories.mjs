import {
	MAX_ACHIEVEMENT_POINTS,
	MAX_CHARM_POINTS,
	MAX_BOSS_POINTS,
	UNFAIR_ACHIEVEMENT_POINTS,
	MAX_ACHIEVEMENT_POINTS_UNFAIR,
} from './max.mjs';

const map = new Map([
	['achievements-filtered', {
		name: 'achievement points (filtered)',
		description: 'Achievement highscores with “unfair” entries (involving coinciding achievements due to rooking characters, worth %%%UNFAIR_ACHIEVEMENT_POINTS%%% points in total) removed. Highest possible score: %%%MAX_ACHIEVEMENT_POINTS%%% points.',
		max: MAX_ACHIEVEMENT_POINTS,
		relatedPrefix: 'achievements',
	}],
	['achievements-unfair', {
		name: 'achievement points (unfair)',
		description: 'Achievement highscores including “unfair” entries (involving coinciding achievements due to rooking characters, worth %%%UNFAIR_ACHIEVEMENT_POINTS%%% points in total). Characters created before the introduction of achievements are unfairly disadvantaged in these rankings. Highest possible score: %%%MAX_ACHIEVEMENT_POINTS_UNFAIR%%% points.',
		max: MAX_ACHIEVEMENT_POINTS_UNFAIR,
		relatedPrefix: 'achievements',
	}],
	['achievements', {
		name: 'achievement points (adjusted)',
		description: 'Achievement highscores with “unfair” entries (involving coinciding achievements due to rooking characters, worth %%%UNFAIR_ACHIEVEMENT_POINTS%%% points in total) adjusted by deducting those points. Highest possible score: %%%MAX_ACHIEVEMENT_POINTS%%% points.',
		max: MAX_ACHIEVEMENT_POINTS,
		relatedPrefix: 'achievements',
		related: [
			'completionists',
		],
	}],
	['axe-fighting', {
		name: 'axe fighting',
		description: '',
	}],
	['boss-points', {
		name: 'boss points',
		description: 'Highest possible score: %%%MAX_BOSS_POINTS%%% points.',
		max: MAX_BOSS_POINTS,
		related: [
			'completionists',
		],
	}],
	['charm-points', {
		name: 'charm points',
		description: 'Highest possible score: %%%MAX_CHARM_POINTS%%% points.',
		max: MAX_CHARM_POINTS,
		related: [
			'completionists',
		],
	}],
	['club-fighting', {
		name: 'club fighting',
		description: '',
	}],
	['completionists', {
		name: 'completionists',
		description: 'Completionists are players who seek to complete all possible tasks in Tibia. We measure the completeness of a character by considering how many achievement points (max. %%%MAX_ACHIEVEMENT_POINTS%%%), charm points (max. %%%MAX_CHARM_POINTS%%%), and boss points (max. %%%MAX_BOSS_POINTS%%%) it has, based on the maximum amount of these points that can be obtained in the game. Only characters with global top 1000 highscore entries for achievement points, charm points, and boss points are considered.',
		related: [
			'achievements',
			'charm-points',
			'boss-points',
		],
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
		relatedPrefix: 'experience',
	}],
	['experience-knights', {
		name: 'experience (knights)',
		description: '',
		relatedPrefix: 'experience',
	}],
	['experience-paladins', {
		name: 'experience (paladins)',
		description: '',
		relatedPrefix: 'experience',
	}],
	['experience-sorcerers', {
		name: 'experience (sorcerers)',
		description: '',
		relatedPrefix: 'experience',
	}],
	['experience', {
		name: 'experience (all vocations)',
		description: '',
		relatedPrefix: 'experience',
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
		relatedPrefix: 'magic-level',
	}],
	['magic-level-knights', {
		name: 'magic level (knights)',
		description: '',
		relatedPrefix: 'magic-level',
	}],
	['magic-level-paladins', {
		name: 'magic level (paladins)',
		description: '',
		relatedPrefix: 'magic-level',
	}],
	['magic-level-sorcerers', {
		name: 'magic level (sorcerers)',
		description: '',
		relatedPrefix: 'magic-level',
	}],
	['magic-level', {
		name: 'magic level (all vocations)',
		description: '',
		relatedPrefix: 'magic-level',
	}],
	['shielding-druids', {
		name: 'shielding (druids)',
		description: '',
		relatedPrefix: 'shielding',
	}],
	['shielding-knights', {
		name: 'shielding (knights)',
		description: '',
		relatedPrefix: 'shielding',
	}],
	['shielding-paladins', {
		name: 'shielding (paladins)',
		description: '',
		relatedPrefix: 'shielding',
	}],
	['shielding-sorcerers', {
		name: 'shielding (sorcerers)',
		description: '',
		relatedPrefix: 'shielding',
	}],
	['shielding', {
		name: 'shielding (all vocations)',
		description: '',
		relatedPrefix: 'shielding',
	}],
	['sword-fighting', {
		name: 'sword fighting',
		description: '',
	}],
]);
const categoryIds = Array.from(map.keys());
// Expand `relatedPrefix` into `related` entries.
for (const [categoryId, metaData] of map) {
	const prefix = metaData.relatedPrefix;
	if (!prefix) continue;
	const relatedIds = categoryIds.filter((id) => {
		return id !== categoryId && id.startsWith(prefix);
	});
	if (metaData.related) {
		metaData.related.unshift(...relatedIds);
	} else {
		metaData.related = relatedIds;
	}
}

const intFormatter = new Intl.NumberFormat('en', {
	maximumFractionDigits: 0,
});
const formatInt = (number) => {
	return intFormatter.format(number);
};

const populateDescription = (description) => {
	return (
		description
			.replaceAll('%%%MAX_ACHIEVEMENT_POINTS%%%', formatInt(MAX_ACHIEVEMENT_POINTS))
			.replaceAll('%%%MAX_CHARM_POINTS%%%', formatInt(MAX_CHARM_POINTS))
			.replaceAll('%%%MAX_BOSS_POINTS%%%', formatInt(MAX_BOSS_POINTS))
			.replaceAll('%%%UNFAIR_ACHIEVEMENT_POINTS%%%', formatInt(UNFAIR_ACHIEVEMENT_POINTS))
			.replaceAll('%%%MAX_ACHIEVEMENT_POINTS_UNFAIR%%%', formatInt(MAX_ACHIEVEMENT_POINTS_UNFAIR))
	);
};

export const getCategoryMetaData = (id) => {
	const metaData = map.get(id);
	metaData.description = populateDescription(metaData.description);
	return metaData;
};
