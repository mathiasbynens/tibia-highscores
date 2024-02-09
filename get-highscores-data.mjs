import fs from 'node:fs/promises';
import fetch from 'node-fetch-retry';
import {adjustUnfairAchievementsHighscoreEntries, removeUnfairAchievementsHighscoreEntries} from './fix-achievements.mjs';
import {computeCompletionists} from './compute-completionists.mjs';

const categoryMap = new Map([ // categoryId → niceCategoryName
	['achievements', 'achievements'],
	['axefighting', 'axe-fighting'],
	['bosspoints', 'boss-points'],
	['charmpoints', 'charm-points'],
	['clubfighting', 'club-fighting'],
	['distancefighting', 'distance-fighting'],
	['dromescore', 'drome-score'],
	['experience', 'experience'],
	['fishing', 'fishing'],
	['fistfighting', 'fist-fighting'],
	['goshnarstaint', 'goshnars-taint'],
	['loyaltypoints', 'loyalty-points'],
	['magiclevel', 'magic-level'],
	['shielding', 'shielding'],
	['swordfighting', 'sword-fighting'],
]);
const normalizeCategory = (categoryId) => {
	return categoryMap.get(categoryId);
};
const CATEGORY_IDS = new Set(categoryMap.keys());
const CATEGORY_IDS_REQUIRING_MORE_PAGES = new Set([
	'achievements',
	'bosspoints',
	'charmpoints',
]);
const VOCATION_IDS = new Set([
	'knights',
	'paladins',
	'druids',
	'sorcerers',
]);
const MAX_PAGE = 5;
const MAX_PAGE_SPECIAL = 20;

const stringify = (data) => {
	return JSON.stringify(data, null, '\t') + '\n';
};

const getHighscoreData = async (categoryId = 'achievements', vocationId = 'all', page = 1, results = []) => {
	const url = `https://api.tibiadata.com/v4/highscores/all/${categoryId}/${vocationId}/${page}`;
	console.log(url);
	const response = await fetch(url, {
		retry: 3,
		pause: 1_000,
	});

	let data = null;
	try {
		data = await response.json();
	} catch {
		console.log('Error in API response. Retrying…');
		return getHighscoreData(categoryId, vocationId, page, results);
	}

	if (data.information.status.error || !data.highscores) {
		console.log('Error in API response. Retrying…');
		return getHighscoreData(categoryId, vocationId, page, results);
	}

	const elements = data.highscores.highscore_list;
	results.push(...elements);
	const maxPage = CATEGORY_IDS_REQUIRING_MORE_PAGES.has(categoryId) ? MAX_PAGE_SPECIAL : MAX_PAGE;
	if (page < maxPage) {
		return getHighscoreData(categoryId, vocationId, page + 1, results);
	}
	return results;
};

const combinations = [];
const INTERESTING_CATEGORY_IDS_FOR_ALL_VOCATIONS = new Set([
	'experience',
	'magiclevel',
	'shielding',
]);
for (const categoryId of CATEGORY_IDS) {
	combinations.push({ categoryId, vocationId: 'all' });
	if (INTERESTING_CATEGORY_IDS_FOR_ALL_VOCATIONS.has(categoryId)) {
		for (const vocationId of VOCATION_IDS) {
			combinations.push({ categoryId, vocationId });
		}
	}
}

for (const combination of combinations) {
	const {categoryId, vocationId} = combination;
	const normalizedCategory = normalizeCategory(categoryId);
	const id = vocationId === 'all' ? normalizedCategory : `${normalizedCategory}-${vocationId}`;
	console.log(`Getting highscore data for category=${normalizedCategory} and vocation=${vocationId}…`);
	const highscores = await getHighscoreData(categoryId, vocationId);
	if (categoryId === 'achievements') {
		await fs.writeFile(`./data/${id}-unfair.json`, stringify(highscores));
		await fs.writeFile(`./data/${id}-filtered.json`, stringify(removeUnfairAchievementsHighscoreEntries(highscores)));
		await fs.writeFile(`./data/${id}.json`, stringify(adjustUnfairAchievementsHighscoreEntries(highscores)));
		continue;
	}
	await fs.writeFile(`./data/${id}.json`, stringify(highscores));
}

const completionists = await computeCompletionists();
await fs.writeFile(`./data/completionists.json`, stringify(completionists));
