import fs from 'node:fs/promises';

import fetch from 'node-fetch-retry';
import jsesc from 'jsesc';

const determineBattleEyeType = (isProtected, date) => {
	if (isProtected) {
		return date === 'release' ? 'green' : 'yellow';
	}
	return 'off';
};

const MAX_RETRY_COUNT = 5;

const getWorldsData = async (retryCount = 0) => {
	const url = 'https://api.tibiadata.com/v4/worlds';
	const response = await fetch(url, {
		retry: 3,
		pause: 1_000,
	});
	let data = null;
	try {
		data = await response.json();
	} catch {
		if (retryCount > MAX_RETRY_COUNT) {
			console.log('Too many retries. Giving up…');
			process.exit(1);
			return new Map();
		}
		console.log('Error in API response. Retrying…');
		return getWorldsData(retryCount + 1);
	}

	if (data.information.status.error || !data.worlds) {
		if (retryCount > MAX_RETRY_COUNT) {
			console.log('Too many retries. Giving up…');
			process.exit(1);
			return new Map();
		}
		console.log('Error in API response. Retrying…');
		return getWorldsData(retryCount + 1);
	}

	const map = new Map();
	const elements = data.worlds.regular_worlds;
	for (const element of elements) {
		const name = element.name;
		const battleEye = determineBattleEyeType(element.battleye_protected, element.battleye_date);
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
const sourceCode = `// Auto-generated using \`get-worlds-data.mjs\`. Do not edit.\n\nexport const worldMap = ${jsesc(worldMap, {
	compact: false,
})};\n`;
await fs.writeFile('./worlds.mjs', sourceCode);
