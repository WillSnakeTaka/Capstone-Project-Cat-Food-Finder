const OPEN_FDA_ENDPOINT = "https://api.fda.gov/food/enforcement.json";

export async function fetchRecallMatchesByNames(names) {
  if (!names.length) return new Set();

  const normalized = names
    .map((name) => name.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 15);

  if (!normalized.length) return new Set();

  // Search broad cat-related recalls, then fuzzy match by product description.
  const query = encodeURIComponent('product_type:"Food"+AND+product_description:cat');
  const url = `${OPEN_FDA_ENDPOINT}?search=${query}&limit=100`;

  try {
    const response = await fetch(url);
    if (!response.ok) return new Set();
    const data = await response.json();
    const recalls = data?.results || [];

    const matches = new Set();
    normalized.forEach((name) => {
      const found = recalls.some((recall) =>
        String(recall.product_description || "").toLowerCase().includes(name)
      );
      if (found) matches.add(name);
    });

    return matches;
  } catch {
    return new Set();
  }
}
