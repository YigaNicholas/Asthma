import { useState, useEffect } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import Battery80Icon from '@mui/icons-material/Battery80';
import Battery60Icon from '@mui/icons-material/Battery60';
import Battery50Icon from '@mui/icons-material/Battery50';
import Battery30Icon from '@mui/icons-material/Battery30';
import Battery20Icon from '@mui/icons-material/Battery20';
import BatteryAlertIcon from '@mui/icons-material/BatteryAlert';
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import FilterDramaIcon from "@mui/icons-material/FilterDrama";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";

export default function Modified() {
  const [data, setData] = useState(null);        // store fetched data
  const [loading, setLoading] = useState(true);  // loading state
  const [error, setError] = useState(null);      // error state

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://api.thingspeak.com/channels/3006338/feeds.json?api_key=YK2YQ9UJCEPUF1X1&results=2");
        if (!res.ok) throw new Error("Failed to fetch data");
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData(); // fetch immediately

    const intervalId = setInterval(fetchData, 3000); // fetch every 3 seconds
    return () => clearInterval(intervalId); // clean up on unmount
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Error: {error}</p>;

  // ✅ get the latest feed data
  const latestFeed = data.feeds[data.feeds.length - 1] || {};

  // ✅ parse battery percentage
  const batteryLevel = Number(latestFeed.field1) || 0;

  // ✅ choose battery icon based on percentage
  let batteryIcon;
  if (batteryLevel >= 90) {
    batteryIcon = <BatteryFullIcon className="text-green-500" fontSize="large" />;
  } else if (batteryLevel >= 75) {
    batteryIcon = <Battery80Icon className="text-green-500" fontSize="large" />;
  } else if (batteryLevel >= 60) {
    batteryIcon = <Battery60Icon className="text-yellow-500" fontSize="large" />;
  } else if (batteryLevel >= 45) {
    batteryIcon = <Battery50Icon className="text-yellow-500" fontSize="large" />;
  } else if (batteryLevel >= 25) {
    batteryIcon = <Battery30Icon className="text-red-500" fontSize="large" />;
  } else if (batteryLevel >= 10) {
    batteryIcon = <Battery20Icon className="text-red-500" fontSize="large" />;
  } else {
    batteryIcon = <BatteryAlertIcon className="text-red-700" fontSize="large" />;
  }

  const stats = [
    {
      name: "Battery Percentage",
      value: batteryLevel + " %",
      icon: batteryIcon,
      description: "Current battery level"
    },
    {
      name: "Carbon Monoxide",
      value: latestFeed.field2,
      icon: <LocalFireDepartmentIcon className="text-red-500" fontSize="large" />,
      description: "Carbon monoxide detected"
    },
    {
      name: "Temperature",
      value: latestFeed.field3,
      icon: <ThermostatIcon className="text-orange-500" fontSize="large" />,
      description: "Ambient temperature"
    },
    {
      name: "Humidity",
      value: latestFeed.field4,
      icon: <WaterDropIcon className="text-blue-500" fontSize="large" />,
      description: "Relative humidity"
    },
    {
      name: "Dust Particles",
      value: latestFeed.field5,
      icon: <FilterDramaIcon className="text-gray-500" fontSize="large" />,
      description: "PM2.5 concentration"
    },
    {
      name: "Gas",
      value: latestFeed.field6, // ✅ fixed typo here
      icon: <LocalGasStationIcon className="text-yellow-500" fontSize="large" />,
      description: "Gas sensor reading"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-200 via-blue-100 to-green-200 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">ASTHMA CONDITIONS MONITOR</h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
    </div>
  );
}
