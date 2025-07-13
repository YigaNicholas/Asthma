import { useState, useEffect } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import BatteryFullIcon from "@mui/icons-material/BatteryFull";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import Battery80Icon from '@mui/icons-material/Battery80';
import Battery60Icon from '@mui/icons-material/Battery60';
import Battery50Icon from '@mui/icons-material/Battery50';
import Battery30Icon from '@mui/icons-material/Battery30';
import Battery20Icon from '@mui/icons-material/Battery20';
import BatteryAlertIcon from '@mui/icons-material/BatteryAlert';
import ThermostatIcon from "@mui/icons-material/Thermostat";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import FilterDramaIcon from "@mui/icons-material/FilterDrama";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";

export default function TimeStamp() {
  const [data, setData] = useState(null);               // store fetched data
  const [loading, setLoading] = useState(true);         // loading state
  const [error, setError] = useState(null);             // error state
  const [timestamp, setTimestamp] = useState(null);     // store last fetched time

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://api.restful-api.dev/objects/ff8081819782e69e0197fd8748dc43b2");
        if (!res.ok) throw new Error("Failed to fetch data");
        const json = await res.json();
        setData(json);
        setTimestamp(new Date().toLocaleTimeString()); // update timestamp
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData(); // fetch immediately on mount

    // cleanup
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Error: {error}</p>;
  const batteryLevel= Number(data.data.battery);// parse from string to number

  let batteryIcon;
  if(batteryLevel>=90){
    batteryIcon= <BatteryFullIcon className="text-green-500" fontSize="large"/>

  }else if(batteryLevel >=75){
    batteryIcon= <Battery80Icon className="text-green-500" fontSize="large"/>
  }else if(batteryLevel >=60){
    batteryIcon= <Battery60Icon className="text-yellow-500" fontSize="large"/>
  }else if(batteryLevel >=45){
    batteryIcon=<Battery50Icon className="text-yellow-500" fontSize="large"/>
  }else {
    batteryIcon=<BatteryAlertIcon className="text-red-700" fontSize="large"/>
  }

  const stats = [
    {
      name: "Battery Percentage",
      value: `${batteryLevel} %`,
      icon: batteryIcon,
      description: "Current battery level"
    },
    {
      name: "Carbon Monoxide",
      value: data.data.carbonMonoxide,
      icon: <LocalFireDepartmentIcon className="text-red-500" fontSize="large" />,
      description: "Carbon monoxide detected"
    },
    {
      name: "Temperature",
      value: data.data.temperature,
      icon: <ThermostatIcon className="text-orange-500" fontSize="large" />,
      description: "Ambient temperature"
    },
    {
      name: "Humidity",
      value: data.data.humidity,
      icon: <WaterDropIcon className="text-blue-500" fontSize="large" />,
      description: "Relative humidity"
    },
    {
      name: "Large Dust Particles",
      value: data.data.dust,
      icon: <FilterDramaIcon className="text-gray-500" fontSize="large" />,
      description: "PM2.5 concentration"
    },
    {
      name: "Gas",
      value: data.data.gas,
      icon: <LocalGasStationIcon className="text-yellow-500" fontSize="large" />,
      description: "Gas sensor reading"
    },
    {
      name: 'Small Dust particles',
      value: data.data.small,
      icon: <FilterDramaIcon className="text-gray-500" fontSize="large" />,
      description:'PM2.5 concentration'
      
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-200 via-blue-100 to-green-200 p-8">
      <h1 className="text-3xl font-bold text-center mb-2">ASTHMA CONDITIONS MONITOR</h1>
      <p className="text-center text-gray-600 mb-8">Last updated at: {timestamp}</p>
      
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
