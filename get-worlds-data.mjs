import fs from 'node:fs/promises';

import { fetchJson } from './utils.mjs';
import jsesc from 'jsesc';

const determineBattleEyeType = (isProtected, date) => {
	if (isProtected) {
		return date === 'release' ? 'green' : 'yellow';
	}
	return 'off';
};

const getWorldsData = async () => {
	const url = 'https://api.tibiadata.com/v4/worlds';
	const data = await fetchJson(url, (data) => !!data.worlds);

	const map = new Map();
	const elements = data.worlds.regular_worlds;
	for (const element of elements) {
		const name = element.name;
		const battleEye = determineBattleEyeType(
			element.battleye_protected,
			element.battleye_date,
		);
		const pvp = element.pvp_type;
		const location = element.location;
		map.set(name, {
			name,
			battleEye,
			pvp,
			location,
		});
	}
	return map;
};

const worldMap = await getWorldsData();
const sourceCode = `// Auto-generated using \`get-worlds-data.mjs\`. Do not edit.\n\nexport const worldMap = ${jsesc(
	worldMap,
	{
		compact: false,
	},
)};\n`;
await fs.writeFile('./worlds.mjs', sourceCode);
