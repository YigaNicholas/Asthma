import { useState } from "react";

function Example() {
  const [allCountries, setAllCountries] = useState([]);   // all countries from API
  const [countries, setCountries] = useState([]);         // displayed countries
  const [offset, setOffset] = useState(0);
  const limit = 10;
  const [loading, setLoading] = useState(false);

  async function fetchCountries(newOffset) {
    setLoading(true);
    try {
      // First time → fetch from API
      if (allCountries.length === 0) {
        const res = await fetch("https://restcountries.com/v3.1/all?fields=name,flags,cca3");
        const data = await res.json();
        console.log(data);

        // Sort by name for consistent order
        const sorted = data.sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );
        setAllCountries(sorted);

        // First batch
        const firstBatch = sorted.slice(newOffset, newOffset + limit);
        setCountries(firstBatch);
      } else {
        // Already have all countries → slice locally
        const nextBatch = allCountries.slice(newOffset, newOffset + limit);

        // Avoid duplicates: filter out countries already displayed
        setCountries(prev => {
          const existing = new Set(prev.map(c => c.cca3));
          const unique = nextBatch.filter(c => !existing.has(c.cca3));
          return [...prev, ...unique];
        });
      }
    } catch (error) {
      console.error("Failed to fetch countries:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleStart() {
    setOffset(0);
    setCountries([]);           // clear old data
    fetchCountries(0);
  }

  function handleLoadMore() {
    const newOffset = offset + limit;
    setOffset(newOffset);
    fetchCountries(newOffset);
  }

  function handleLoadLess() {
    if (offset >= limit) {
      const newOffset = offset - limit;
      setOffset(newOffset);
      setCountries(prev => prev.slice(0, -limit));
    }
  }

  function handleReset() {
    setCountries([]);
    setOffset(0);
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>🌍 Countries Explorer</h1>

      <button onClick={handleStart} disabled={loading}>
        Start
      </button>{" "}
      <button onClick={handleLoadMore} disabled={loading}>
        Load More
      </button>{" "}
      <button onClick={handleLoadLess} disabled={loading || offset === 0}>
        Load Less
      </button>{" "}
      <button onClick={handleReset}>Reset</button>

      {loading && <p>Loading...</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {countries.map(c => (
          <li key={c.cca3} style={{ margin: "8px 0", display: "flex", alignItems: "center" }}>
            <img
              src={c.flags.png}
              alt={c.name.common}
              width={30}
              style={{ marginRight: "8px", borderRadius: "3px" }}
            />
            {c.name.common}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Example;
