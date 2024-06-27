import fs from 'node:fs/promises';
import path from 'node:path';

import {glob} from 'glob';

import {getCategoryMetaData} from './categories.mjs';

const readJsonFile = async (fileName) => {
	const json = await fs.readFile(fileName, 'utf8');
	const data = JSON.parse(json);
	return data;
};

const CHARACTER_NAME = process.argv[2] ?? 'Mathias Bynens';

const jsonFiles = await glob('./data/*.json');
const highScores = [];
for (const jsonFile of jsonFiles) {
	const data = await readJsonFile(jsonFile);
	const entry = data.find((entry) => entry.name === CHARACTER_NAME);
	if (entry) {
		const {rank, value, overallPercentage} = entry;
		const id = path.basename(jsonFile, '.json');
		highScores.push({
			type: id,
			rank: rank,
			value: value ?? overallPercentage,
		});
	}
}
highScores.sort((a, b) => {
	return a.rank - b.rank;
});

console.log(`Highscore entries for character ${CHARACTER_NAME}:`);
for (const highScore of highScores) {
	const meta = getCategoryMetaData(highScore.type);
	const name = meta.name;
	console.log(`- ${name}: rank #${highScore.rank} (${highScore.value})`);
}
