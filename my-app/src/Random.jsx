import { useState, useEffect, useRef } from "react";
import { Card, CardContent, Typography, CircularProgress } from "@mui/material";
import BatteryFullIcon from "@mui/icons-material/BatteryFull";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import FilterDramaIcon from "@mui/icons-material/FilterDrama";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from 'leaflet';
import "leaflet/dist/leaflet.css";

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function MapView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

// Generate random data within realistic ranges
function generateRandomData(baseData) {
  return {
    ...baseData,
    data: {
      battery: Math.max(0, Math.min(100, baseData.data.battery + (Math.random() * 2 - 1))).toFixed(1),
      carbonMonoxide: Math.max(0, baseData.data.carbonMonoxide + (Math.random() * 0.2 - 0.1)).toFixed(2),
      temperature: (baseData.data.temperature + (Math.random() * 0.5 - 0.25)).toFixed(1),
      humidity: Math.max(0, Math.min(100, baseData.data.humidity + (Math.random() * 2 - 1))).toFixed(1),
      dust: Math.max(0, baseData.data.dust + (Math.random() * 5 - 2.5)).toFixed(1),
      gas: Math.max(0, baseData.data.gas + (Math.random() * 0.5 - 0.25)).toFixed(2),
      small: Math.max(0, baseData.data.small + (Math.random() * 3 - 1.5)).toFixed(1)
    }
  };
}

export default function Random() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  const [position, setPosition] = useState([0.3476, 32.5825]);
  const [locationError, setLocationError] = useState(null);
  const [locationName, setLocationName] = useState("Kampala, Uganda");
  const [updating, setUpdating] = useState(false);
  const intervalRef = useRef(null);

  const fetchData = async () => {
    setUpdating(true);
    try {
      const res = await fetch("https://api.restful-api.dev/objects/ff8081819782e69e0197f368b9f41325");
      if (!res.ok) throw new Error("Failed to fetch data");
      const json = await res.json();
      
      // For demo purposes, we'll generate random variations of the data
      // In a real app, you would use the actual API response
      const newData = generateRandomData(json);
      
      setData(newData);
      setTimestamp(new Date().toLocaleTimeString());
      setError(null);
      setLoading(false)
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    // Initial data fetch
    fetchData();

    // Set up interval for auto-refresh
    intervalRef.current = setInterval(fetchData, 3000);

    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
          
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            setLocationName(
              data.address?.city || 
              data.address?.town || 
              data.address?.village || 
              "Your location"
            );
          } catch (err) {
            console.error("Geocoding error:", err);
            setLocationName("Your current location");
          }
        },
        (err) => {
          setLocationError("Location access denied. Using default location.");
          console.error("Geolocation error:", err);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }

    // Clean up interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <CircularProgress size={60} />
    </div>
  );

  if (error) return <p className="text-center mt-10 text-red-500">Error: {error}</p>;

  const stats = [
    { name: "Battery Percentage", value: data.data.battery, unit: "%", icon: <BatteryFullIcon className="text-green-500" fontSize="large" />, description: "Current battery level" },
    { name: "Carbon Monoxide", value: data.data.carbonMonoxide, unit: "ppm", icon: <LocalFireDepartmentIcon className="text-red-500" fontSize="large" />, description: "Carbon monoxide detected" },
    { name: "Temperature", value: data.data.temperature, unit: "°C", icon: <ThermostatIcon className="text-orange-500" fontSize="large" />, description: "Ambient temperature" },
    { name: "Humidity", value: data.data.humidity, unit: "%", icon: <WaterDropIcon className="text-blue-500" fontSize="large" />, description: "Relative humidity" },
    { name: "Large Dust Particles", value: data.data.dust, unit: "µg/m³", icon: <FilterDramaIcon className="text-gray-500" fontSize="large" />, description: "PM10 concentration" },
    { name: "Gas", value: data.data.gas, unit: "kΩ", icon: <LocalGasStationIcon className="text-yellow-500" fontSize="large" />, description: "Gas sensor reading" },
    { name: "Small Dust Particles", value: data.data.small, unit: "µg/m³", icon: <FilterDramaIcon className="text-gray-500" fontSize="large" />, description: "PM2.5 concentration" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-200 via-blue-100 to-green-200 p-4 md:p-8">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl md:text-3xl font-bold">ASTHMA CONDITIONS MONITOR</h1>
        {updating && (
          <div className="flex items-center text-blue-600">
            <CircularProgress size={20} className="mr-2" />
            <span>Updating...</span>
          </div>
        )}
      </div>
      
      <p className="text-gray-600 mb-4 md:mb-8">Last updated at: {timestamp}</p>

      {locationError && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded">
          <p>{locationError}</p>
        </div>
      )}

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6 md:mb-8">
        {stats.map((stat) => (
          <Card key={stat.name} className="shadow-xl rounded-2xl hover:shadow-2xl transition-shadow relative">
            {updating && (
              <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center rounded-2xl z-10">
                <CircularProgress size={30} />
              </div>
            )}
            <CardContent className="flex flex-col items-center text-center p-4 md:p-6">
              <div className="mb-2 md:mb-4">{stat.icon}</div>
              <Typography variant="h6" className="font-semibold mb-1 md:mb-2 text-sm md:text-base">
                {stat.name}
              </Typography>
              <Typography 
                variant="h4" 
                className="font-bold text-gray-800 mb-1 text-xl md:text-2xl transition-all duration-300"
              >
                {stat.value} {stat.unit}
              </Typography>
              <Typography variant="body2" className="text-gray-500 text-xs md:text-sm">
                {stat.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Map Section */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <h2 className="text-lg md:text-xl font-semibold text-center py-3 md:py-4">Location Map</h2>
        <div className="relative h-64 sm:h-80 md:h-96 w-full">
          <MapContainer 
            center={position} 
            zoom={13} 
            scrollWheelZoom={true} 
            className="h-full w-full"
            style={{ minHeight: '256px' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Popup>
                Asthma Monitor Location<br/>{locationName}
              </Popup>
            </Marker>
            <MapView center={position} />
          </MapContainer>
          <div className="absolute bottom-4 right-4 bg-white p-2 rounded-md shadow-md z-[1000] text-xs">
            Lat: {position[0].toFixed(4)}, Lng: {position[1].toFixed(4)}
          </div>
        </div>
      </div>
    </div>
  );
}