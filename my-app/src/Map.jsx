import { useState, useEffect } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import BatteryFullIcon from "@mui/icons-material/BatteryFull";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import FilterDramaIcon from "@mui/icons-material/FilterDrama";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function Map() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timestamp, setTimestamp] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://api.restful-api.dev/objects/ff8081819782e69e0197f368b9f41325");
        if (!res.ok) throw new Error("Failed to fetch data");
        const json = await res.json();
        setData(json);
        setTimestamp(new Date().toLocaleTimeString());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Error: {error}</p>;

  const stats = [
    { name: "Battery Percentage", value: data.data.battery, icon: <BatteryFullIcon className="text-green-500" fontSize="large" />, description: "Current battery level" },
    { name: "Carbon Monoxide", value: data.data.carbonMonoxide, icon: <LocalFireDepartmentIcon className="text-red-500" fontSize="large" />, description: "Carbon monoxide detected" },
    { name: "Temperature", value: data.data.temperature, icon: <ThermostatIcon className="text-orange-500" fontSize="large" />, description: "Ambient temperature" },
    { name: "Humidity", value: data.data.humidity, icon: <WaterDropIcon className="text-blue-500" fontSize="large" />, description: "Relative humidity" },
    { name: "Large Dust Particles", value: data.data.dust, icon: <FilterDramaIcon className="text-gray-500" fontSize="large" />, description: "PM2.5 concentration" },
    { name: "Gas", value: data.data.gas, icon: <LocalGasStationIcon className="text-yellow-500" fontSize="large" />, description: "Gas sensor reading" },
    { name: 'Small Dust particles', value: data.data.small, icon: <FilterDramaIcon className="text-gray-500" fontSize="large" />, description:'PM2.5 concentration' }
  ];

  // Default coordinates (replace with real location)
  const position = [0.3476, 32.5825]; // Kampala, Uganda

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-200 via-blue-100 to-green-200 p-8">
      <h1 className="text-3xl font-bold text-center mb-2">ASTHMA CONDITIONS MONITOR</h1>
      <p className="text-center text-gray-600 mb-8">Last updated at: {timestamp}</p>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {stats.map((stat) => (
          <Card key={stat.name} className="shadow-xl rounded-2xl">
            <CardContent className="flex flex-col items-center text-center p-6">
              <div className="mb-4">{stat.icon}</div>
              <Typography variant="h6" className="font-semibold mb-2">{stat.name}</Typography>
              <Typography variant="h4" className="font-bold text-gray-800 mb-1">{stat.value}</Typography>
              <Typography variant="body2" className="text-gray-500">{stat.description}</Typography>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Map Section */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <h2 className="text-xl font-semibold text-center py-4">Location Map</h2>
        <MapContainer center={position} zoom={13} scrollWheelZoom={false} className="h-80 w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              Asthma Monitor Location<br/> Kampala, Uganda
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
