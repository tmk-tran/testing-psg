export function getCurrentSeason(activeYearObj) {
  if (!Array.isArray(activeYearObj) || activeYearObj.length === 0) return null;

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // JS months 0-11

  // Season starts Sep 2, ends Sep 1 next year
  const currentSeasonStr =
    month >= 9 ? `${year}-${year + 1}` : `${year - 1}-${year}`;

  return activeYearObj.find((y) => y.year === currentSeasonStr) || null;
}
