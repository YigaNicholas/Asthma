import { useState, useEffect } from "react";
import { Card, CardContent, Typography , CircularProgress} from "@mui/material";
import BatteryFullIcon from "@mui/icons-material/BatteryFull";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import FilterDramaIcon from "@mui/icons-material/FilterDrama";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import Battery80Icon from '@mui/icons-material/Battery80';
import Battery60Icon from '@mui/icons-material/Battery60';
import Battery50Icon from '@mui/icons-material/Battery50';
import Battery30Icon from '@mui/icons-material/Battery30';
import Battery20Icon from '@mui/icons-material/Battery20';
import BatteryAlertIcon from '@mui/icons-material/BatteryAlert';

// Fix for default marker icons in Leaflet with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Component to handle map view changes
function MapView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function NewMap() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  const [position, setPosition] = useState([0.3476, 32.5825]); // Default to Kampala
  const [locationError, setLocationError] = useState(null);
  const [locationName, setLocationName] = useState("Kampala, Uganda");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://api.thingspeak.com/channels/3006338/feeds.json?api_key=YK2YQ9UJCEPUF1X1&results=2");
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

    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
          
          try {
            // Reverse geocoding to get location name
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

    fetchData();

    
  }, []);

  if (loading) return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress size={60} />
      </div>);
  if (error) return <p className="text-center mt-10 text-red-500">Error: {error}</p>;

  const latestFeed= data.feeds[data.feeds.length-1] || {}


  const batteryLevel= Number(latestFeed.field3);// parse from string to number


  // battery percentage section
  let batteryIcon;
  if(batteryLevel>=90){
    batteryIcon= <BatteryFullIcon className="text-green-500" fontSize="large"/>

  }else if(batteryLevel >=75){
    batteryIcon= <Battery80Icon className="text-green-500" fontSize="large"/>
  }else if(batteryLevel >=60){
    batteryIcon= <Battery60Icon className="text-yellow-500" fontSize="large"/>
  }else if(batteryLevel >=45){
    batteryIcon=<Battery50Icon className="text-yellow-500" fontSize="large"/>
  }else if(batteryLevel >=25){
     batteryIcon = <Battery30Icon className="text-red-500" fontSize="large" />;
  }else if(batteryLevel >=10){
    batteryIcon = <Battery20Icon className="text-red-500" fontSize="large" />;
  }
  else {
    batteryIcon=<BatteryAlertIcon className="text-red-700" fontSize="large"/>
    
  }

  // data is now available, use it to fill in the dashboard

  
  const stats = [
    { name: "Battery Percentage", value:`${latestFeed.field3}%`, icon: batteryIcon, description: "Current battery level" },
    { name: "Carbon Monoxide", value: `${latestFeed.field2} ppm`, icon: <LocalFireDepartmentIcon className="text-red-500" fontSize="large" />, description: "Carbon monoxide detected" },
    { name: "Temperature", value: `${latestFeed.field3}  °C`, icon: <ThermostatIcon className="text-orange-500" fontSize="large" />, description: "Ambient temperature" },
    { name: "Humidity", value: `${latestFeed.field4} %`, icon: <WaterDropIcon className="text-blue-500" fontSize="large" />, description: "Relative humidity" },
    { name: "Large Dust Particles", value: `${latestFeed.field6} µg/m³`, icon: <FilterDramaIcon className="text-gray-500" fontSize="large" />, description: "PM2.5 concentration" },
    { name: "Gas", value: `${latestFeed.field1} ppm`, icon: <LocalGasStationIcon className="text-yellow-500" fontSize="large" />, description: "Gas sensor reading" },
    { name: 'Small Dust particles', value: `${latestFeed.field5} µg/m³`, icon: <FilterDramaIcon className="text-gray-500" fontSize="large" />, description:'PM2.5 concentration' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-200 via-blue-100 to-green-200 p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">ASTHMA CONDITIONS MONITOR</h1>
      <p className="text-center text-gray-600 mb-4 md:mb-8">Last updated at: {timestamp}</p>

      {locationError && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded">
          <p>{locationError}</p>
        </div>
      )}

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6 md:mb-8">
        {stats.map((stat) => (
          <Card key={stat.name} className="shadow-xl rounded-2xl hover:shadow-2xl transition-shadow">
            <CardContent className="flex flex-col items-center text-center p-4 md:p-6">
              <div className="mb-2 md:mb-4">{stat.icon}</div>
              <Typography variant="h6" className="font-semibold mb-1 md:mb-2 text-sm md:text-base">{stat.name}</Typography>
              <Typography variant="h4" className="font-bold text-gray-800 mb-1 text-xl md:text-2xl">{stat.value}</Typography>
              <Typography variant="body2" className="text-gray-500 text-xs md:text-sm">{stat.description}</Typography>
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