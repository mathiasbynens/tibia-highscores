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
			});
		}
	}

	for (const [name, stats] of characters) {
		stats.overallPercentage = Math.round(100 * (stats.achievementPointsPercentage + stats.charmPointsPercentage + stats.bossPointsPercentage) / 3) / 100;
	}
	const completionists = Array.from(characters.values()).sort((a, b) => {
		return b.overallPercentage - a.overallPercentage;
	}).slice(0, MAX_ENTRIES);
	let rank = 1;
	for (const entry of completionists) {
		entry.rank = rank++;
	}
	return completionists;

};
