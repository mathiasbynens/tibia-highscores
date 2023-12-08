import fs from 'node:fs/promises';

import { escape as escapeHtml } from 'lodash-es';
import { minify as minifyHtml } from 'html-minifier-terser';

const readJsonFile = async (fileName) => {
	const json = await fs.readFile(fileName, 'utf8');
	const data = JSON.parse(json);
	return data;
};

const intFormatter = new Intl.NumberFormat('en', {
	maximumFractionDigits: 0,
});
const formatInt = (number) => {
	return intFormatter.format(number);
};

const percentageFormatter = new Intl.NumberFormat('en', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const formatPercentage = (number) => {
	return percentageFormatter.format(number) + '%';
};

const isoDate = (date) => {
	return date.toISOString().slice(0, 10);
};
const dateId = isoDate(new Date());

const vocationMap = new Map([
	['Elite Knight', 'EK'],
	['Knight', 'K'],
	['Royal Paladin', 'RP'],
	['Paladin', 'P'],
	['Elder Druid', 'ED'],
	['Druid', 'D'],
	['Master Sorcerer', 'MS'],
	['Sorcerer', 'S'],
]);
const abbreviateVocation = (vocation) => {
	return vocationMap.get(vocation) || vocation;
};

const renderHtml = (highscores, categoryId) => {
	const output = [
		`<p>Last updated on <time>${escapeHtml(dateId)}</time>.`,
	];
/*
		"achievementPoints": 1276,
		"charmPoints": 23825,
		"bossPoints": 19935,
		"score": 280.08
*/
	const isCompletionists = 'completionists' === categoryId;
	const table = [];
	if (isCompletionists) {
		table.push('<div class="table-wrapper"><table><thead><tr><th>Rank<th>Name<th>Level + vocation<th>World<th>Achievement points<th>Charm points<th>Boss points<th>Score<th>Completion percentage<tbody>');
	} else {
		table.push('<div class="table-wrapper"><table><thead><tr><th>Rank<th>Name<th>Level + vocation<th>World<th>Value<tbody>');
	}
	for (const entry of highscores) {
		if (isCompletionists) {
			table.push(`
				<tr>
					<th scope=row>${escapeHtml(entry.rank)}
					<th scope=row>${escapeHtml(entry.name)}
					<td>${escapeHtml(formatInt(entry.level))} ${escapeHtml(abbreviateVocation(entry.vocation))}
					<td>${escapeHtml(entry.world)}
					<td>${escapeHtml(formatInt(entry.achievementPoints))}
					<td>${escapeHtml(formatInt(entry.charmPoints))}
					<td>${escapeHtml(formatInt(entry.bossPoints))}
					<td>${escapeHtml(formatInt(entry.score))}
					<td>${escapeHtml(formatPercentage(entry.overallPercentage))}
			`);
		} else {
			table.push(`
				<tr>
					<th scope=row>${escapeHtml(entry.rank)}
					<th scope=row>${escapeHtml(entry.name)}
					<td>${escapeHtml(formatInt(entry.level))} ${escapeHtml(abbreviateVocation(entry.vocation))}
					<td>${escapeHtml(entry.world)}
					<td>${escapeHtml(formatInt(entry.value))}
			`);
		}
	}
	table.push('</table></div>');
	output.push(table.join(''));
	const html = output.join('');
	return html;
};

const HTML_TEMPLATE = (await fs.readFile('./templates/index.html', 'utf8')).toString();
export const updateHtml = async (id) => {
	const highscores = await readJsonFile(`./data/${id}.json`);
	const html = HTML_TEMPLATE
		.replaceAll('%%%CATEGORY%%%', id)
		.replace('%%%DATA%%%', renderHtml(highscores, id));
	const minifiedHtml = await minifyHtml(html, {
		collapseBooleanAttributes: true,
		collapseInlineTagWhitespace: false,
		collapseWhitespace: true,
		conservativeCollapse: true,
		decodeEntities: true,
		html5: true,
		includeAutoGeneratedTags: false,
		minifyCSS: true,
		minifyJS: true,
		preserveLineBreaks: false,
		preventAttributesEscaping: true,
		removeAttributeQuotes: true,
		removeComments: true,
		removeEmptyAttributes: true,
		removeEmptyElements: false,
		removeOptionalTags: false,
		removeRedundantAttributes: true,
		removeTagWhitespace: false,
		sortAttributes: true,
		sortClassName: true,
	});
	await fs.writeFile(`./dist/${id}.html`, minifiedHtml);
};

const ids = new Set([
	'achievements',
	'achievements-unfair',
	'axe-fighting',
	'boss-points',
	'charm-points',
	'club-fighting',
	'completionists',
	'distance-fighting',
	'drome-score',
	'experience',
	'experience-druids',
	'experience-knights',
	'experience-paladins',
	'experience-sorcerers',
	'fishing',
	'fist-fighting',
	'goshnars-taint',
	'loyalty-points',
	'magic-level',
	'magic-level-druids',
	'magic-level-knights',
	'magic-level-paladins',
	'magic-level-sorcerers',
	'shielding-druids',
	'shielding-knights',
	'shielding-paladins',
	'shielding-sorcerers',
	'shielding',
	'sword-fighting',
]);
for (const id of ids) {
	await updateHtml(id);
}
