import React, { useState } from "react";

function Joke() {
  const [jokes, setJokes] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadMoreJokes = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://official-joke-api.appspot.com/jokes/ten");
      const data = await res.json();

      // Filter out jokes we already have (by id)
      const existingIds = new Set(jokes.map((j) => j.id));
      const newUniqueJokes = data.filter((j) => !existingIds.has(j.id));

      setJokes((prev) => [...prev, ...newUniqueJokes]);
    } catch (error) {
      console.error("Failed to fetch jokes:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Joke Collector</h1>
      <div className="space-x-2 mb-4">
        <button
          onClick={loadMoreJokes}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Loading..." : "Load More Jokes"}
        </button>
        <button
          onClick={() => setJokes([])}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Clear Jokes
        </button>
      </div>

      <ul className="space-y-2">
        {jokes.map((joke) => (
          <li
            key={joke.id}
            className="border p-2 rounded shadow"
          >
            <p className="font-semibold">{joke.setup}</p>
            <p>{joke.punchline}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Joke;
