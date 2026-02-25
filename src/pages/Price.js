import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Price() {
  const { symbol } = useParams();
  const apiKey = process.env.REACT_APP_COINAPI_KEY;
  const [coin, setCoin] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const getCoin = async () => {
      if (!apiKey) {
        setError("Missing API key. Add REACT_APP_COINAPI_KEY to your .env file.");
        return;
      }

      try {
        setError("");
        setCoin(null);
        const response = await fetch(
          `https://rest.coinapi.io/v1/exchangerate/${symbol}/USD?apikey=${apiKey}`
        );

        if (!response.ok) {
          throw new Error(`Request failed (${response.status}).`);
        }

        const data = await response.json();
        setCoin(data);
      } catch (e) {
        setError(e.message || "Unable to load price right now.");
      }
    };

    getCoin();
  }, [symbol, apiKey]);

  if (error) {
    return (
      <section className="panel">
        <h1>{symbol}/USD</h1>
        <p className="error">{error}</p>
      </section>
    );
  }

  if (!coin) {
    return (
      <section className="panel">
        <h1>{symbol}/USD</h1>
        <p>Loading...</p>
      </section>
    );
  }

  return (
    <section className="panel">
      <h1>
        {coin.asset_id_base}/{coin.asset_id_quote}
      </h1>
      <h2>${coin.rate.toLocaleString(undefined, { maximumFractionDigits: 4 })}</h2>
      <p className="hint">Data source: CoinAPI</p>
    </section>
  );
}
