import { useEffect, useState } from "react";
import { createMusicianPost, listMusicianPosts } from "../api/communityApi";
import CatPhotoBanner from "../components/CatPhotoBanner";
import { MusicianPost } from "../types";

const initialPost = {
  stageName: "",
  style: "",
  caption: "",
  favoriteTrack: "",
};

export default function CatMusiciansPage() {
  const [posts, setPosts] = useState<MusicianPost[]>([]);
  const [form, setForm] = useState(initialPost);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    try {
      setPosts(await listMusicianPosts());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load musician feed.");
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    try {
      await createMusicianPost(form);
      setForm(initialPost);
      await loadPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to post musician update.");
    }
  }

  return (
    <section className="page-stack">
      <CatPhotoBanner
        title="Cat Musicians Social Club"
        subtitle="A playful community feed for jazz cats, meow-metal drummers, and lounge-tabby vocalists."
        tone="gold"
      />

      <div className="community-grid community-grid-wide">
        <form className="card form-grid" onSubmit={handleSubmit}>
          <h2>Share a Cat Band Update</h2>
          <label>
            Stage name
            <input value={form.stageName} onChange={(e) => setForm({ ...form, stageName: e.target.value })} placeholder="DJ Whiskerbeat" required />
          </label>
          <label>
            Style
            <input value={form.style} onChange={(e) => setForm({ ...form, style: e.target.value })} placeholder="Lo-fi purr jazz" required />
          </label>
          <label>
            Favorite track
            <input value={form.favoriteTrack} onChange={(e) => setForm({ ...form, favoriteTrack: e.target.value })} placeholder="Moonlight Meow Sonata" required />
          </label>
          <label>
            Caption
            <textarea value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} rows={5} required />
          </label>
          <button type="submit">Publish to the cat feed</button>
          {error && <p className="error-text">{error}</p>}
        </form>

        <section className="card">
          <h2>Live Cat Music Feed</h2>
          {!posts.length ? (
            <p className="status-card">No musician updates yet.</p>
          ) : (
            <div className="community-feed">
              {posts.map((post) => (
                <article className="community-post" key={post.id}>
                  <div className="row-between">
                    <strong>{post.stageName}</strong>
                    <span className="pill dry">{post.style}</span>
                  </div>
                  <p>{post.caption}</p>
                  <p className="muted-line">Now spinning: {post.favoriteTrack}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
