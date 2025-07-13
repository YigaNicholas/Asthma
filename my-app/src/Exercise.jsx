import { useState } from "react";


function Exercise() {
    const [pokemons, setPokemons] = useState([]);  // each will have name & image url
  const [offset, setOffset] = useState(0);
  const limit = 10;
  const [loading, setLoading] = useState(false);

  async function fetchPokemons(customOffset) {
  setLoading(true);
  try {
    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${customOffset}`
    );
    const data = await res.json();

    // Now fetch details for each Pokémon to get image
    const detailed = await Promise.all([
      data.results.map(async (p) => {
        const res2 = await fetch(p.url);
        const details = await res2.json();
        return {
          name: details.name,
          image: details.sprites.front_default
        };
      })
    ]);

    setPokemons(prev => [...prev, ...detailed]);
  } catch (error) {
    console.error("Failed to fetch Pokémon:", error);
  } finally {
    setLoading(false);
  }
}

function handleLoadPokemons() {
  setOffset(0);
  setPokemons([]);             // reset first
  fetchPokemons(0);
}

function handleLoadMore() {
  const newOffset = offset + limit;
  setOffset(newOffset);
  fetchPokemons(newOffset);
}

function handleLoadLess() {
  if (offset >= limit) {
    const newOffset = offset - limit;
    setOffset(newOffset);
    setPokemons(prev => prev.slice(0, -limit)); // remove last 10
  }
}

function handleReset() {
  setPokemons([]);
  setOffset(0);
}



  return(
    <div>
        <h1>
            pokemon gallery
        </h1>

        <button onClick={handleLoadPokemons} disabled={loading}>load pokemon</button>
        <button onClick={handleLoadMore} disabled={loading}>load 10 more</button>
        <button onClick={handleLoadLess} disabled={loading||offset===0}>load less</button>
        <button onClick={handleReset}>reset</button>

        {loading && <p>loading...</p>}

        <div style={{ display: "flex", flexWrap: "wrap" }}>
            {pokemons.map((p)=>(
                <div key={p.name} style={{ margin: "10px", textAlign: "center" }}>
                    <img src={p.image} alt={p.name} width={80} height={80} />
                    <p>{p.name}</p>
                </div>
            ))}
        </div>
    </div>
  )
}

export default Exercise