export function getCurrentSeason(activeYearObj) {
  if (!Array.isArray(activeYearObj) || activeYearObj.length === 0) return null;

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // JS months 0-11

  // Calculate current and next season strings
  const currentSeasonStr =
    month >= 9 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
  const nextSeasonStr =
    month >= 9 ? `${year + 1}-${year + 2}` : `${year}-${year + 1}`;

  // Try current season first, then next
  return (
    activeYearObj.find((y) => y.year === currentSeasonStr) ||
    activeYearObj.find((y) => y.year === nextSeasonStr) ||
    null
  );
}
