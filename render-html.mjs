import fs from 'node:fs/promises';

import {escape as escapeHtml} from 'lodash-es';
import {minify as minifyHtml} from 'html-minifier-terser';

import {getCategoryMetaData} from './categories.mjs';
import {generateWorldHtml} from './worlds-utils.mjs';

import {MAX_ACHIEVEMENT_POINTS, MAX_CHARM_POINTS, MAX_BOSS_POINTS} from './max.mjs';

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

const linkCharacter = (characterName) => {
	const encoded = encodeURIComponent(characterName).replaceAll('%20', '+');
	return `https://www.tibia.com/community/?subtopic=characters&name=${encoded}`;
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

const listFormatter = new Intl.ListFormat('en');
const renderRelatedHtml = (related) => {
	if (!related) return '';
	const links = [];
	for (const relatedId of related) {
		const name = getCategoryMetaData(relatedId).name;
		links.push(`<a href="${relatedId}">${escapeHtml(name)}</a>`);
	}
	const html = `<p>See also: ${listFormatter.format(links)}.`;
	return html;
};

const renderHtml = (highscores, categoryId, maxValue = false) => {
	const output = [
		`<p>Last updated on <time>${escapeHtml(dateId)}</time>.`,
	];
	const isCompletionists = 'completionists' === categoryId;
	const table = [];
	if (isCompletionists) {
		table.push('<div class="table-wrapper"><table><thead><tr><th>Rank<th>Name<th>Level + vocation<th>World<th>Achievement points<th>Charm points<th>Boss points<th>Completion percentage<tbody>');
	} else {
		table.push(`<div class="table-wrapper"><table><thead><tr><th>Rank<th>Name<th>Level + vocation<th>World<th>${maxValue ? 'Points' : 'Value'}<tbody>`);
	}
	for (const entry of highscores) {
		if (isCompletionists) {
			table.push(`
				<tr id="${escapeHtml(entry.name)}">
					<th scope=row>${escapeHtml(entry.rank)}
					<th scope=row><a href="${escapeHtml(linkCharacter(entry.name))}" rel="nofollow">${escapeHtml(entry.name)}</a>
					<td>${escapeHtml(entry.level)} ${escapeHtml(abbreviateVocation(entry.vocation))}
					<td>${generateWorldHtml(entry.world)}
					<td${entry.isTopAchievementPoints ? ' class="top"' : ''}${entry.isBottomAchievementPoints ? ' class="bottom"' : ''} title="${escapeHtml(formatInt(entry.achievementPoints))} out of ${escapeHtml(formatInt(MAX_ACHIEVEMENT_POINTS))} achievement points ≈ ${escapeHtml(formatPercentage(entry.achievementPointsPercentage))}">${escapeHtml(formatInt(entry.achievementPoints))} <progress max="100" value="${escapeHtml(entry.achievementPointsPercentage)}"></progress>
					<td${entry.isTopCharmPoints ? ' class="top"' : ''}${entry.isBottomCharmPoints ? ' class="bottom"' : ''} title="${escapeHtml(formatInt(entry.charmPoints))} out of ${escapeHtml(formatInt(MAX_CHARM_POINTS))} charm points ≈ ${escapeHtml(formatPercentage(entry.charmPointsPercentage))}">${escapeHtml(formatInt(entry.charmPoints))} <progress max="100" value="${escapeHtml(entry.charmPointsPercentage)}"></progress>
					<td${entry.isTopBossPoints ? ' class="top"' : ''}${entry.isBottomBossPoints ? ' class="bottom"' : ''} title="${escapeHtml(formatInt(entry.bossPoints))} out of ${escapeHtml(formatInt(MAX_BOSS_POINTS))} boss points ≈ ${escapeHtml(formatPercentage(entry.bossPointsPercentage))}">${escapeHtml(formatInt(entry.bossPoints))} <progress max="100" value="${escapeHtml(entry.bossPointsPercentage)}"></progress>
					<td${entry.isTopOverallPercentage ? ' class="top"' : ''}${entry.isBottomOverallPercentage ? ' class="bottom"' : ''}>${escapeHtml(formatPercentage(entry.overallPercentage))} <progress max="100" value="${escapeHtml(entry.overallPercentage)}"></progress>
			`);
		} else {
			const points = entry.value;
			const percentage = maxValue ? (Math.round(10_000 * entry.value / maxValue) / 100) : 0;
			table.push(`
				<tr id="${escapeHtml(entry.name)}">
					<th scope=row>${escapeHtml(entry.rank)}
					<th scope=row><a href="${escapeHtml(linkCharacter(entry.name))}" rel="nofollow">${escapeHtml(entry.name)}</a>
					<td>${escapeHtml(entry.level)} ${escapeHtml(abbreviateVocation(entry.vocation))}
					<td>${generateWorldHtml(entry.world)}
					<td${maxValue ? ` title="${escapeHtml(formatInt(points))} out of ${escapeHtml(formatInt(maxValue))} points ≈ ${escapeHtml(formatPercentage(percentage))}"` : ''}${maxValue === points ? ' class="top"' : ''}>${escapeHtml(formatInt(points))}${maxValue ? ` <progress max="100" value="${escapeHtml(percentage)}"></progress>` : ''}
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
	const meta = getCategoryMetaData(id);
	if (!meta) console.log(id);
	const html = HTML_TEMPLATE
		.replaceAll('%%%CATEGORY%%%', escapeHtml(meta.name))
		.replaceAll('%%%DESCRIPTION%%%', escapeHtml(meta.description))
		.replaceAll('%%%RELATED%%%', renderRelatedHtml(meta.related))
		.replace('%%%DATA%%%', renderHtml(highscores, id, meta.max));
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
	'achievements-filtered',
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
