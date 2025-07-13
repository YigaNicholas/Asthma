import { useState } from "react";

const api = '90c2d5377efaca54c92b3076685780e4';

function Ex() {
  const [response, setResponse] = useState(null);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    setError('');
    if (!city.trim()) {
      setError('Please enter a city');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api}&units=metric`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error('City not found');
      }

      setResponse(data);
    } catch (error) {
      setError('Failed to fetch data');
      setResponse(null);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">🌤️ Weather Search</h2>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="flex-1 px-3 py-2 border rounded"
        />
        <button
          onClick={fetchWeather}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {loading && <p className="mt-4 text-gray-600">Loading...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      {response && (
        <div className="mt-4 border p-4 rounded shadow-sm bg-white">
          {Object.entries(response).map(([key, value]) => (
    <p key={key}>
      {key}: {typeof value === 'object' ? JSON.stringify(value) : value}
    </p>
  ))}
        </div>
      )}
    </div>
  );
}

export default Ex;
