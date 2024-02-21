// Characters confirmed to have been rooked in order to obtain coinciding
// achievements that are otherwise impossible to get.
export const CHARACTER_BLOCKLIST = new Set([
	'Annie Arelluf',
	'Elyrea',
	'Firdeso',
	'Garoto Do Sorriso',
	'Horon Aoldas',
	'Inge Naning',
	'Kapunia',
	'Lord Strikee',
	'Luther Hargreeves',
	'Marcus Eon',
	'Niix Insanity',
	'Offf Liiineee',
	'Rei Davi Benyhwh',
	'The Monho',
	'Vinicius shocks',
]);

const checkCharacter = async (characterName) => {
	const url = `https://api.tibiadata.com/v4/character/${encodeURIComponent(characterName)}`;
	console.log(`Checking ${characterName}…`);
	const response = await fetch(url);

	let data = null;
	try {
		data = await response.json();
	} catch {
		console.log('Error in API response. Retrying…');
		return getHighscoreData(categoryId, vocationId, page, results);
	}

	if (data.information.status.error || !data.character) {
		console.log('Error in API response. Retrying…');
		return getCharacterData(characterName);
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
