const CAT_FACTS_URL = "https://catfact.ninja/facts?limit=6";
const CAT_IMAGE_URL = "https://api.thecatapi.com/v1/images/search?limit=1";
const FALLBACK_CAT_IMAGE = "https://cdn2.thecatapi.com/images/d86.jpg";

export async function getCatFacts(_req, res) {
  try {
    const response = await fetch(CAT_FACTS_URL);
    if (!response.ok) throw new Error("cat facts provider failed");
    const payload = await response.json();
    const facts = Array.isArray(payload.data) ? payload.data.map((item) => item.fact).slice(0, 6) : [];
    return res.json({ facts });
  } catch {
    return res.json({
      facts: [
        "Cats are obligate carnivores and need taurine from animal protein.",
        "Hydration is critical: wet food can support urinary tract health.",
        "Rapid appetite loss in cats can be dangerous and needs vet attention.",
      ],
    });
  }
}

export async function getCatImage(_req, res) {
  try {
    const response = await fetch(CAT_IMAGE_URL);
    if (!response.ok) throw new Error("cat image provider failed");
    const payload = await response.json();
    const imageUrl = Array.isArray(payload) && payload[0]?.url ? payload[0].url : FALLBACK_CAT_IMAGE;
    return res.json({ imageUrl });
  } catch {
    return res.json({ imageUrl: FALLBACK_CAT_IMAGE });
  }
}
