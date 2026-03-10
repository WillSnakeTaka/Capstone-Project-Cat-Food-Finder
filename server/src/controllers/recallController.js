const FDA_ENDPOINT = "https://api.fda.gov/food/enforcement.json";

function tokenize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2);
}

function hasWordOverlap(a, b) {
  const aSet = new Set(tokenize(a));
  const bSet = tokenize(b);
  return bSet.some((word) => aSet.has(word));
}

export async function findRecalls(req, res) {
  const { names = "" } = req.query;
  const productNames = names
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean)
    .slice(0, 25);

  if (!productNames.length) return res.json({ matches: [] });

  const response = await fetch(`${FDA_ENDPOINT}?limit=100`);
  if (!response.ok) {
    return res.status(502).json({ message: "Recall provider unavailable" });
  }

  const data = await response.json();
  const results = Array.isArray(data.results) ? data.results : [];

  const matches = productNames.filter((name) =>
    results.some((record) => {
      const text = [
        record.product_description,
        record.reason_for_recall,
        record.recalling_firm,
      ]
        .filter(Boolean)
        .join(" ");
      return hasWordOverlap(name, text);
    })
  );

  return res.json({ matches });
}
