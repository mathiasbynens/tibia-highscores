import fetch from 'node-fetch-retry';

// Characters confirmed to have been rooked in order to obtain coinciding
// achievements that are otherwise impossible to get.
export const CHARACTER_BLOCKLIST = new Set([
	'Alpha Charlyne',
	'Annie Arelluf',
	'Archangel Bonetto',
	'Bloodrunk Leech',
	'Capitao Athim',
	'Clu Eless',
	'Crowbar',
	'Daf Knight',
	'Demoniqued',
	'Fantasma Druid',
	'Firdeso',
	'Galdrek',
	'Garoto Do Sorriso',
	'Gznho',
	'Hardwave',
	'Horon Aoldas',
	'Inge Naning',
	'Jhos Kevarib',
	'Kapunia',
	'King of Raw',
	'Lady Of Egypt',
	'Lali Hilip',
	'Lord Strikee',
	'Luther Hargreeves',
	'Marcus Eon',
	'Muzyk Monk Wielki',
	'Natth Morza',
	'Niix Insanity',
	'Nutri',
	'Odrixz',
	'Offf Liiineee',
	'Ptu',
	'The Monho',
	'Vemon',
	'Vinicius shocks',
	'Woundz',
	'Yxx xy',
]);

const MAX_RETRY_COUNT = 5;

const checkCharacter = async (characterName, retryCount = 0) => {
	const url = `https://api.tibiadata.com/v4/character/${encodeURIComponent(characterName)}`;
	console.log(`Checking ${characterName}…`);
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
			return false;
		}
		console.log('Error in API response. Retrying…');
		return checkCharacter(characterName, retryCount + 1);
	}

	if (data.information.status.error || !data.character) {
		if (retryCount > MAX_RETRY_COUNT) {
			console.log('Too many retries. Giving up…');
			process.exit(1);
			return false;
		}
		console.log('Error in API response. Retrying…');
		return checkCharacter(characterName, retryCount + 1);
	}

	const currentName = data.character.character.name;
	if (currentName !== characterName) {
		console.error(`!!! ${characterName} renamed to ${currentName}!`);
		return false;
	}
	return true;
};

const test = async () => {
	let hasErrors = false;
	for (const character of CHARACTER_BLOCKLIST) {
		const isOkay = await checkCharacter(character);
		if (!isOkay) hasErrors = true;
	}
	if (hasErrors) {
		throw new Error('Issues detected.');
	}
};

if (process.env.TEST) {
	await test();
}
