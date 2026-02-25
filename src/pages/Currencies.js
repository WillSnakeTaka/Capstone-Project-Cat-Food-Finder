import { Link } from "react-router-dom";

const currencies = [
  { name: "Bitcoin", symbol: "BTC" },
  { name: "Litecoin", symbol: "LTC" },
  { name: "Ethereum", symbol: "ETH" },
  { name: "Ethereum Classic", symbol: "ETC" },
  { name: "Stellar Lumens", symbol: "XLM" },
  { name: "Dash", symbol: "DASH" },
  { name: "Ripple", symbol: "XRP" },
  { name: "Zcash", symbol: "ZEC" },
];

export default function Currencies() {
  return (
    <section className="panel">
      <h1>Currencies</h1>
      <div className="currency-grid">
        {currencies.map((coin) => (
          <Link key={coin.symbol} className="currency-card" to={`/price/${coin.symbol}`}>
            <h2>{coin.name}</h2>
            <p>{coin.symbol}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
