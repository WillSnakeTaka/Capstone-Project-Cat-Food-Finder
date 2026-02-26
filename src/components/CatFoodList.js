export default function CatFoodList({ items, onEdit, onDelete, recallMatches }) {
  if (!items.length) {
    return <p className="status-card">No cat food entries yet.</p>;
  }

  return (
    <div className="list-grid">
      {items.map((item) => {
        const isRecallMatch = recallMatches.has(item.name.trim().toLowerCase());

        return (
          <article className="card" key={item.id}>
            <div className="row-between">
              <h3>{item.name}</h3>
              <span className={`pill ${item.type}`}>{item.type}</span>
            </div>
            <p><strong>Brand:</strong> {item.brand}</p>
            <p><strong>Size:</strong> {item.size || "n/a"}</p>
            <p>{item.description || "No description provided."}</p>
            {isRecallMatch && <span className="recall-badge">Potential FDA Recall Match</span>}
            <div className="row">
              <button type="button" onClick={() => onEdit(item)}>Edit</button>
              <button className="danger-btn" type="button" onClick={() => onDelete(item.id)}>
                Delete
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
