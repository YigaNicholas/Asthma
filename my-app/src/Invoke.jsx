import { useEffect, useState } from "react";
function Invoke() {
    const [pokemons, setPokemons] = useState([]);
  const [offset, setOffset] = useState(10);
  const limit = 10;
  const [loading, setLoading] = useState(false);

  async function fetchPokemons() {
    setLoading(true);
    try {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
      );
      const data = await res.json();
      console.log(data); // Now this will log!

    setPokemons(data.results)
       // Update state with fetched data
    } catch (error) {
      console.error("Failed to fetch Pokémon:", error);
    } finally {
      setLoading(false);
    }
  }
  

   return (
    <div>
      <button onClick={() => {
  const newOffset = offset + limit;
  setOffset(newOffset);
  fetchPokemons(newOffset);
}}>
  Load More
</button>
      {loading && <p>Loading...</p>}
      <ul>
        {pokemons.map((pokemon) => (
          <li key={pokemon.url}>{pokemon.name}</li>
        ))}
      </ul>
      
      <button onClick={()=>setPokemons([])}>reset</button>
      
      <button
  onClick={() => {
    if (offset >= limit) {
      const newOffset = offset - limit;
      setOffset(newOffset);
      fetchPokemons(newOffset);
    }
  }}
  disabled={offset === 0}
>
  loadless
</button>
    </div>
    
  );

}
export default Invoke;