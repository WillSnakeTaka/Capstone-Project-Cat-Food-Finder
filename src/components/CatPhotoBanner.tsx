import { useEffect, useState } from "react";
import { fetchCatImage } from "../api/catHealthApi";

export default function CatPhotoBanner({
  title,
  subtitle,
  tone = "peach",
}: {
  title: string;
  subtitle: string;
  tone?: "peach" | "mint" | "gold";
}) {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    let active = true;

    async function loadImage() {
      try {
        const data = await fetchCatImage();
        if (active) setImageUrl(data.imageUrl || "");
      } catch {
        if (active) setImageUrl("");
      }
    }

    loadImage();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className={`cat-banner cat-banner-${tone} card`}>
      <div className="cat-banner-copy">
        <p className="eyebrow">CatCart Daily</p>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="cat-banner-media">
        {imageUrl ? <img src={imageUrl} alt={title} /> : <div className="cat-banner-fallback">cat photo loading</div>}
      </div>
    </section>
  );
}
