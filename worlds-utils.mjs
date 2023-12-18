import {worldMap} from './worlds.mjs';

const FLAG_BR = '\u{1F1E7}\u{1F1F7}';
const FLAG_UK = '\u{1F1EC}\u{1F1E7}';
const FLAG_US = '\u{1F1FA}\u{1F1F8}';

const CIRCLE_WHITE = '\u26AA';
const CIRCLE_YELLOW = '\u{1F7E1}';
const CIRCLE_GREEN = '\u{1F7E2}';

const generateFlagHtml = (location) => {
	switch (location) {
		case 'Europe': {
			return `<abbr title="United Kingdom / Europe">${FLAG_UK}</abbr>`;
		}
		case 'North America': {
			return `<abbr title="North America">${FLAG_US}</abbr>`;
		}
		case 'South America': {
			return `<abbr title="South America">${FLAG_BR}</abbr>`;
		}
		default: {
			return location;
		}
	}
};

const generateBattleEyeHtml = (battleEyeType) => {
	switch (battleEyeType) {
		case 'green': {
			return `<abbr title="Green BattleEye">${CIRCLE_GREEN}</abbr>`;
		}
		case 'yellow': {
			return `<abbr title="Yellow BattleEye">${CIRCLE_YELLOW}</abbr>`;
		}
		case 'off': {
			return `<abbr title="No BattleEye">${CIRCLE_WHITE}</abbr>`;
		}
		default: {
			return battleEyeType;
		}
	}
}
export const generateWorldHtml = (worldName) => {
	const entry = worldMap.get(worldName);
	return `${worldName} ${generateFlagHtml(entry.location)} ${generateBattleEyeHtml(entry.battleEye)}`;
};
