const computeBaseBossBonus = (bossPoints) => {
	if (bossPoints < 250) {
		return Math.floor(25 + bossPoints / 10);
	}
	if (bossPoints < 1250) {
		return Math.floor(37.5 + bossPoints / 20);
	}
	return Math.floor(
		100 + 1 / 2 * (Math.sqrt((8 * ((bossPoints - 1250) / 5)) + 81) - 9)
	);
};

export const computeBossBonuses = (bossPoints) => {
	const base = computeBaseBossBonus(bossPoints);
	const mastery = base + 25;
	return {base, mastery};
};
