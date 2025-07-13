import { useEffect, useState } from "react"

function Poke() {
    const[pokemons, setPokemons]=useState([]);
    const[offset, setOffset]= useState(0);
    const limit = 10;// number of pokemon per page
    const[loading, setLoading]= useState(false)

    useEffect(()=>{
        fetchPokemons()
    }, [offset])

    async function fetchPokemons() {
        setLoading(true);
        try {
            const res= await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
            const data= await res.json()
            console.log(data)

            //fetch details for each pokemon to get stats
             const detailedData = await Promise.all(
        data.results.map(async (result) => {
          const res = await fetch(result.url);
          return await res.json();
        })
      );
        setPokemons(detailedData)
        } catch (error) {
            console.error(error)
        }
        setLoading(false);
    }

        function handleNext() {
        setOffset(offset + limit);
        }

        function handlePrev() {
        if (offset >= limit) {
        setOffset(offset - limit);
        }
    }


        
        
        return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Pokémon Explorer</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-4">
          {pokemons.map((pokemon) => (
            <li key={pokemon.id} className="border p-2 rounded">
              <h2 className="text-lg font-semibold capitalize">{pokemon.name}</h2>
              <p>ID: {pokemon.id}</p>
              <p>Base experience: {pokemon.base_experience}</p>
              <div>
                <strong>Stats:</strong>
                <ul>
                  {pokemon.stats.map((stat) => (
                    <li key={stat.stat.name}>
                      {stat.stat.name}: {stat.base_stat}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePrev}
          disabled={offset === 0}
          className="bg-blue-500 text-white px-3 py-1 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );

}
export default Poke