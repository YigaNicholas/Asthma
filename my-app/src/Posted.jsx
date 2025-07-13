import { useState } from "react";

function Posted() {
  const [data, setData] = useState({
    name: '',
    battery: '',
    carbonmonoxide: '',
    temperature: '',
    humidity: '',
    dust: '',
    gas: ''
  });

  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [createdObjects, setCreatedObjects] = useState([]); // list of posted objects

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const postData = async (e) => {
    e.preventDefault();
    setError('');
    setResponse(null);

    try {
      const res = await fetch('https://api.restful-api.dev/objects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: data.name,
          data: {
            "battery": Number(data.battery),
            "carbonmonoxide": Number(data.carbonmonoxide),
            "temperature": data.temperature, // send as string so you can include "%"
            "humidity": data.humidity,
            "dust": data.dust,
            "gas": data.gas
          }
        })
      });

      if (!res.ok) throw new Error("Failed to post data");

      const result = await res.json();
      console.log(result);
      setResponse(result);

      // save the created object locally
      setCreatedObjects(prev => [...prev, { id: result.id, name: result.name }]);

      // reset the form
      setData({
        name: '',
        battery: '',
        carbonmonoxide: '',
        temperature: '',
        humidity: '',
        dust: '',
        gas: ''
      });
    } catch (error) {
      setError(error.message || 'An error occurred');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold">Post Product to API</h2>
      <form onSubmit={postData} className="space-y-3">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={data.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="number"
          name="battery"
          placeholder="Battery"
          value={data.battery}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="number"
          step="0.01"
          name="carbonmonoxide"
          placeholder="Carbon Monoxide"
          value={data.carbonmonoxide}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="text"
          name="temperature"
          placeholder="Temperature (e.g. 56%)"
          value={data.temperature}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="text"
          name="humidity"
          placeholder="Humidity"
          value={data.humidity}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="text"
          name="dust"
          placeholder="Dust"
          value={data.dust}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="text"
          name="gas"
          placeholder="Gas"
          value={data.gas}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>

      {error && <p className="text-red-500">{error}</p>}

      {response && (
        <div className="p-3 bg-green-100 text-green-800 rounded">
          <strong>Response:</strong>
          <pre className="text-sm overflow-auto">{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}

      {createdObjects.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Created Objects:</h3>
          <ul className="list-disc list-inside space-y-1">
            {createdObjects.map((obj, index) => (
              <li key={index}>
                <a
                  href={`https://api.restful-api.dev/objects/${obj.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {obj.name} (ID: {obj.id})
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Posted;
