import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

const LineChartComponent = ({ data, selectedDataset }) => {
    switch (selectedDataset) {
        case 'temperature':
            data = data.map((entry) => ({
                name: entry.date,
                value: entry.value,
            }));
            break;
        case 'ph':
            data = data.map((entry) => ({
                name: entry.date,
                value: entry.value,
            }));
            break;
        case 'No2':
            data = data.map((entry) => ({
                name: entry.date,
                value: entry.value,
            }));
            break;
        case 'No3':
            data = data.map((entry) => ({
                name: entry.date,
                value: entry.value,
            }));
            break;
        case 'GH':
            data = data.map((entry) => ({
                name: entry.date,
                value: entry.value,
            }));
            break;
        case 'KH':
            data = data.map((entry) => ({
                name: entry.date,
                value: entry.value,
            }));
            break;
        default:
            data = data.map((entry) => ({
                name: entry.date,
                value: entry.value,
            }));
    }
    // convert data from format: "2024-06-28T15:28:18.316000" to 2024-06-28 15:28:18
    data = data.map((entry) => ({
        ...entry,
        name: entry.name.replace('T', ' ').split('.')[0],
    }));
    if (data.length === 0) {
        return <div>No data to display</div>;
    }

    return (
        <div style={{ width: '100%', height: '70vh'}}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{
                        right: 30,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip selectedDataset={selectedDataset} />} />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default LineChartComponent;

const CustomTooltip = ({ active, payload, label, selectedDataset }) => {
    let unit = "";
    switch (selectedDataset) {
        case 'temperature':
            unit = "°C"
            break;
        case 'ph':
            unit = ""
            break;
        case 'No2':
            unit = "mg/L"
            break;
        case 'No3':
            unit = "mg/L"
            break;
        case 'GH':
            unit = "°dGH"
            break;
        case 'KH':
            unit = "°dKH"
            break;
        default:
            unit = "unit undefined"
    }
    if (active && payload && payload.length) {
        return (
            <div className="p-4 bg-slate-900 flex flex-col gap-4 rounded-md">
                <p className="text-medium text-lg">{label}</p>
                <p className="text-sm text-blue-400">
                    {selectedDataset}:
                    <span className="ml-2">{payload[0].value}{unit}</span>
                </p>
            </div>
        );
    }
    return null;
};
