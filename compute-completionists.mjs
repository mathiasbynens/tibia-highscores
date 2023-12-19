import fs from 'node:fs/promises';
import {CHARACTER_BLOCKLIST, UNFAIR_ACHIEVEMENT_POINTS} from './fix-achievements.mjs';
import {MAX_ACHIEVEMENT_POINTS, MAX_CHARM_POINTS, MAX_BOSS_POINTS} from './max.mjs';

const readJsonFile = async (fileName) => {
	const json = await fs.readFile(fileName, 'utf8');
	const data = JSON.parse(json);
	return data;
};

const MAX_ENTRIES = 100;

export const computeCompletionists = async () => {
	const achievements = await readJsonFile('./data/achievements-unfair.json');
	const bossPoints = await readJsonFile('./data/boss-points.json');
	const charmPoints = await readJsonFile('./data/charm-points.json');

	const characters = new Map();
	for (const entry of achievements) {
		const characterName = entry.name;
		const points = CHARACTER_BLOCKLIST.has(characterName)
			? entry.value - UNFAIR_ACHIEVEMENT_POINTS
			: entry.value;
		const achievementPointsPercentage = Math.round(10_000 * points / MAX_ACHIEVEMENT_POINTS) / 100;
		characters.set(characterName, {
			rank: 0,
			name: characterName,
			vocation: entry.vocation,
			world: entry.world,
			level: entry.level,
			achievementPoints: points,
			isTopAchievementPoints: false,
			isBottomAchievementPoints: false,
			charmPoints: 0,
			isTopCharmPoints: false,
			isBottomCharmPoints: false,
			bossPoints: 0,
			isTopBossPoints: false,
			isBottomBossPoints: false,
			achievementPointsPercentage: achievementPointsPercentage,
			charmPointsPercentage: 0,
			bossPointsPercentage: 0,
			overallPercentage: 0,
			isTopOverallPercentage: false,
			isBottomOverallPercentage: false,
		});
	}

	for (const entry of charmPoints) {
		const characterName = entry.name;
		const points = entry.value;
		const charmPointsPercentage = Math.round(10_000 * points / MAX_CHARM_POINTS) / 100;
		if (characters.has(characterName)) {
			const character = characters.get(characterName);
			character.charmPoints = points;
			character.charmPointsPercentage = charmPointsPercentage;
		} else {
			characters.set(characterName, {
				rank: 0,
				name: characterName,
				vocation: entry.vocation,
				world: entry.world,
				level: entry.level,
				achievementPoints: 0,
				isTopAchievementPoints: false,
				isBottomAchievementPoints: false,
				charmPoints: points,
				isTopCharmPoints: false,
				isBottomCharmPoints: false,
				bossPoints: 0,
				isTopBossPoints: false,
				isBottomBossPoints: false,
				achievementPointsPercentage: 0,
				charmPointsPercentage: charmPointsPercentage,
				bossPointsPercentage: 0,
				overallPercentage: 0,
				isTopOverallPercentage: false,
				isBottomOverallPercentage: false,
			});
		}
	}

	for (const entry of bossPoints) {
		const characterName = entry.name;
		const points = entry.value;
		const bossPointsPercentage = Math.round(10_000 * points / MAX_BOSS_POINTS) / 100;
		if (characters.has(characterName)) {
			const character = characters.get(characterName);
			character.bossPoints = points;
			character.bossPointsPercentage = bossPointsPercentage;
		} else {
			characters.set(characterName, {
				rank: 0,
				name: characterName,
				vocation: entry.vocation,
				world: entry.world,
				level: entry.level,
				achievementPoints: 0,
				isTopAchievementPoints: false,
				isBottomAchievementPoints: false,
				charmPoints: 0,
				isTopCharmPoints: false,
				isBottomCharmPoints: false,
				bossPoints: points,
				isTopBossPoints: false,
				isBottomBossPoints: false,
				achievementPointsPercentage: 0,
				charmPointsPercentage: 0,
				bossPointsPercentage: bossPointsPercentage,
				overallPercentage: 0,
				isTopOverallPercentage: false,
				isBottomOverallPercentage: false,
			});
		}
	}

	for (const [name, stats] of characters) {
		const overallPercentage = Math.round(100 * (stats.achievementPointsPercentage + stats.charmPointsPercentage + stats.bossPointsPercentage) / 3) / 100;
		stats.overallPercentage = overallPercentage;
	}

	const completionists = Array.from(characters.values()).sort((a, b) => {
		return b.overallPercentage - a.overallPercentage;
	}).slice(0, MAX_ENTRIES);
	let rank = 1;
	for (const entry of completionists) {
		entry.rank = rank++;
	}

	// Find the highest scores for each category within the top `MAX_ENTRIES` entries.
	const top = {
		achievementPoints: -1,
		charmPoints: -1,
		bossPoints: -1,
		overallPercentage: -1,
	};
	const bottom = {
		achievementPoints: Infinity,
		charmPoints: Infinity,
		bossPoints: Infinity,
		overallPercentage: Infinity,
	};
	for (const stats of completionists) {
		const {achievementPoints, charmPoints, bossPoints, overallPercentage} = stats;

		if (achievementPoints > top.achievementPoints) top.achievementPoints = achievementPoints;
		if (charmPoints > top.charmPoints) top.charmPoints = charmPoints;
		if (bossPoints > top.bossPoints) top.bossPoints = bossPoints;
		if (overallPercentage > top.overallPercentage) top.overallPercentage = overallPercentage;

		if (achievementPoints < bottom.achievementPoints) bottom.achievementPoints = achievementPoints;
		if (charmPoints < bottom.charmPoints) bottom.charmPoints = charmPoints;
		if (bossPoints < bottom.bossPoints) bottom.bossPoints = bossPoints;
		if (overallPercentage < bottom.overallPercentage) bottom.overallPercentage = overallPercentage;
	}
	for (const stats of completionists) {
		const {achievementPoints, charmPoints, bossPoints, overallPercentage} = stats;

		if (achievementPoints === top.achievementPoints) stats.isTopAchievementPoints = true;
		if (charmPoints === top.charmPoints) stats.isTopCharmPoints = true;
		if (bossPoints === top.bossPoints) stats.isTopBossPoints = true;
		if (overallPercentage === top.overallPercentage) stats.isTopOverallPercentage = true;

		if (achievementPoints === bottom.achievementPoints) stats.isBottomAchievementPoints = true;
		if (charmPoints === bottom.charmPoints) stats.isBottomCharmPoints = true;
		if (bossPoints === bottom.bossPoints) stats.isBottomBossPoints = true;
		if (overallPercentage === bottom.overallPercentage) stats.isBottomOverallPercentage = true;
	}

	return completionists;
};
