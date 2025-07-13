
import { Card, CardContent, Typography } from "@mui/material";
import BatteryFullIcon from "@mui/icons-material/BatteryFull";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import FilterDramaIcon from "@mui/icons-material/FilterDrama";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";

export default function Akasajja() {
const stats = [
{
name: "Battery Percentage",
value: "85%",
icon: <BatteryFullIcon className="text-green-500" fontSize="large" />,
description: "Current battery level"
},
{
name: "Carbon Monoxide",
value: "0.8 ppm",
icon: <LocalFireDepartmentIcon className="text-red-500" fontSize="large" />,
description: "Carbon monoxide detected"
},
{
name: "Temperature",
value: "24°C",
icon: <ThermostatIcon className="text-orange-500" fontSize="large" />,
description: "Ambient temperature"
},
{
name: "Humidity",
value: "60%",
icon: <WaterDropIcon className="text-blue-500" fontSize="large" />,
description: "Relative humidity"
},
{
name: "Dust Particles",
value: "12 µg/m³",
icon: <FilterDramaIcon className="text-gray-500" fontSize="large" />,
description: "PM2.5 concentration"
},
{
name: "Gas",
value: "1.2%",
icon: <LocalGasStationIcon className="text-yellow-500" fontSize="large" />,
description: "Gas sensor reading"
},
];

return (
<div className="min-h-screen bg-gradient-to-r from-purple-200 via-blue-100 to-green-200 p-8">
<h1 className="text-3xl font-bold text-center mb-8">Environmental Dashboard</h1>
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

