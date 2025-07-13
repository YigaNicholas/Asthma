import { useState } from "react";

function Crypto() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const fetchCoins = async (pageNumber) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=${pageNumber}&sparkline=false`
      );
      const data = await res.json();
      setCoins(data);
    } catch (err) {
      console.error("Failed to fetch coins:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleShowCoins = () => {
    setPage(1);
    fetchCoins(1);
  };

  const handleNextPage = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchCoins(nextPage);
  };

  const handlePrevPage = () => {
    if (page === 1) return;
    const prevPage = page - 1;
    setPage(prevPage);
    fetchCoins(prevPage);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>🪙 Crypto Prices Tracker</h2>

      {coins.length === 0 && !loading && (
        <button onClick={handleShowCoins}>Show Coins</button>
      )}

      {loading && <p>Loading...</p>}

      {!loading && coins.length > 0 && (
        <>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {coins.map((coin) => (
              <li key={coin.id} style={{ margin: "10px 0" }}>
                <strong>{coin.name}</strong> ({coin.symbol.toUpperCase()}): $
                {coin.current_price}
              </li>
            ))}
          </ul>
          <div style={{ marginTop: "10px" }}>
            <button onClick={handlePrevPage} disabled={page === 1}>
              Previous Page
            </button>
            <span style={{ margin: "0 10px" }}>Page {page}</span>
            <button onClick={handleNextPage}>Next Page</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Crypto;
