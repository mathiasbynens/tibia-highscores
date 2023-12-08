import fs from 'node:fs/promises';
import {CHARACTER_BLOCKLIST} from './fix-achievements.mjs';

const readJsonFile = async (fileName) => {
	const json = await fs.readFile(fileName, 'utf8');
	const data = JSON.parse(json);
	return data;
};

// Characters that rook themselves can unlock a number of coinciding
// achievements, resulting in some additional points. Since this is
// feasible for new characters but not feasible for characters that
// already existed when achievements were introduced, this is considered
// to be unfair overall.
const UNFAIR_ACHIEVEMENT_POINTS = 45;

const MAX_ACHIEVEMENT_POINTS = 1302; // TODO: Add points for "The Rule of Raccool" once known.
const MAX_CHARM_POINTS = 24275;
const MAX_BOSS_POINTS = 24950;

// Points beyond 90% of the max get a 25% bonus on the score.
const SCORE_BONUS_QUANTILE = 0.90;
const SCORE_BONUS_MULTIPLIER = 1.25;

// Score bonus limits.
const ACHIEVEMENT_POINTS_BONUS_LIMIT = Math.round(MAX_ACHIEVEMENT_POINTS * SCORE_BONUS_QUANTILE);
const CHARM_POINTS_BONUS_LIMIT = Math.round(MAX_CHARM_POINTS * SCORE_BONUS_QUANTILE);
const BOSS_POINTS_BONUS_LIMIT = Math.round(MAX_BOSS_POINTS * SCORE_BONUS_QUANTILE);

const achievements = await readJsonFile('./data/achievements-unfair.json');
const bossPoints = await readJsonFile('./data/boss-points.json');
const charmPoints = await readJsonFile('./data/charm-points.json');

const characters = new Map();
for (const entry of achievements) {
	const characterName = entry.name;
	const achievementPoints = CHARACTER_BLOCKLIST.has(characterName)
		? entry.value - UNFAIR_ACHIEVEMENT_POINTS
		: entry.value;
	const achievementPointsPercentage = Math.round(10_000 * achievementPoints / MAX_ACHIEVEMENT_POINTS) / 100;
	characters.set(characterName, {
		rank: 0,
		name: characterName,
		vocation: entry.vocation,
		world: entry.world,
		level: entry.level,
		achievementPoints: achievementPoints,
		charmPoints: 0,
		bossPoints: 0,
		achievementPointsPercentage: achievementPointsPercentage,
		charmPointsPercentage: 0,
		bossPointsPercentage: 0,
		overallPercentage: 0,
		score: 0,
	});
}

for (const entry of charmPoints) {
	const characterName = entry.name;
	const charmPointsPercentage = Math.round(10_000 * entry.value / MAX_CHARM_POINTS) / 100;
	if (characters.has(characterName)) {
		const character = characters.get(characterName);
		character.charmPoints = entry.value;
		character.charmPointsPercentage = charmPointsPercentage;
	} else {
		characters.set(characterName, {
			rank: 0,
			name: characterName,
			vocation: entry.vocation,
			world: entry.world,
			level: entry.level,
			achievementPoints: 0,
			charmPoints: entry.value,
			bossPoints: 0,
			achievementPointsPercentage: 0,
			charmPointsPercentage: charmPointsPercentage,
			bossPointsPercentage: 0,
			overallPercentage: 0,
			score: 0,
		});
	}
}

for (const entry of bossPoints) {
	const characterName = entry.name;
	const bossPointsPercentage = Math.round(10_000 * entry.value / MAX_BOSS_POINTS) / 100;
	if (characters.has(characterName)) {
		const character = characters.get(characterName);
		character.bossPoints = entry.value;
		character.bossPointsPercentage = bossPointsPercentage;
	} else {
		characters.set(characterName, {
			rank: 0,
			name: characterName,
			vocation: entry.vocation,
			world: entry.world,
			level: entry.level,
			achievementPoints: 0,
			charmPoints: 0,
			bossPoints: entry.value,
			achievementPointsPercentage: 0,
			charmPointsPercentage: 0,
			bossPointsPercentage: bossPointsPercentage,
			overallPercentage: 0,
			score: 0,
		});
	}
}

const computeScore = (entry) => {
	const extraAchievementPoints = entry.achievementPoints - ACHIEVEMENT_POINTS_BONUS_LIMIT;
	const extraCharmPoints = entry.charmPoints - CHARM_POINTS_BONUS_LIMIT;
	const extraBossPoints = entry.bossPoints - BOSS_POINTS_BONUS_LIMIT;
	let achievementScore = entry.achievementPoints / MAX_ACHIEVEMENT_POINTS;
	if (extraAchievementPoints > 0) {
		achievementScore = (extraAchievementPoints * SCORE_BONUS_MULTIPLIER + ACHIEVEMENT_POINTS_BONUS_LIMIT) / MAX_ACHIEVEMENT_POINTS;
	}
	let charmScore = entry.charmPoints / MAX_CHARM_POINTS;
	if (extraCharmPoints > 0) {
		charmScore = (extraCharmPoints * SCORE_BONUS_MULTIPLIER + CHARM_POINTS_BONUS_LIMIT) / MAX_CHARM_POINTS;
	}
	let bossScore = entry.bossPoints / MAX_BOSS_POINTS;
	if (extraBossPoints > 0) {
		bossScore = (extraBossPoints * SCORE_BONUS_MULTIPLIER + BOSS_POINTS_BONUS_LIMIT) / MAX_BOSS_POINTS;
	}
	const score = Math.round((achievementScore + charmScore + bossScore) * 10_000) / 100;
	return score;
};

for (const [name, stats] of characters) {
	stats.score = computeScore(stats);
	stats.overallPercentage = Math.round(100 * (stats.achievementPointsPercentage + stats.charmPointsPercentage + stats.bossPointsPercentage) / 3) / 100;
}
export const completionists = Array.from(characters.values()).sort((a, b) => {
	return b.score - a.score;
});
let rank = 1;
for (const entry of completionists) {
	entry.rank = rank++;
}
