export default function Main() {
  return (
    <section className="panel">
      <h1>Crypto Price Tracker</h1>
      <p>Use the navigation to browse currencies and view live USD exchange rates.</p>
      <p className="hint">Tip: add your key in <code>.env</code> as <code>REACT_APP_COINAPI_KEY=...</code>.</p>
    </section>
  );
}
