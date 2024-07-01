import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LineChartComponent from '../../components/LineChart';
import '../../CSS/AquaMonitorDetails.css';

const AquariumDetails = () => {
    const { aquariumName } = useParams();
    const navigate = useNavigate();
    const [aquariumData, setAquarium] = useState({});
    const [selectedDataset, setSelectedDataset] = useState('temperature');
    const [chartData, setChartData] = useState([]);


    useEffect(() => {
        // Fetch aquarium data from backend
        const fetchAquariumData = async () => {
            try {
                // log all aquarium data. console.log(aquarium) returns [Object Object], we need to log each key-value pair
                // console.log(aquarium) // returns [Object Object]
                console.log("Details aquarium name: " + aquariumName)
                const tokenString = localStorage.getItem("authToken");
                const tokenObj = JSON.parse(tokenString);
                const response = await fetch(`http://localhost:8000/aquariums/history/${aquariumName}?token=${tokenObj.access_token}`);
                const data = await response.json();
                setAquarium(data);
                setChartData(data[selectedDataset]); // Initialize with the first dataset
            } catch (error) {
                console.error('Error fetching aquarium data:', error, error.message);
            }
        };
        fetchAquariumData();
    }, [aquariumName, selectedDataset]);

    const handleDatasetChange = (dataset) => {
        setSelectedDataset(dataset);
        //setChartData(aquarium[dataset]);
    };

    return (
        <div className="aquamonitor">
            <div className="aquamonitor-details">
                <h1>Aquarium Monitor Details</h1>
                <h2>Aquarium: {aquariumName}</h2>
                <button onClick={() => navigate(-1)}>Go Back</button>
                <LineChartComponent data={chartData} />
            </div>
            <div className="aquamonitor-controls">
                <button onClick={() => handleDatasetChange('temperature')}>Temperature</button>
                <button onClick={() => handleDatasetChange('ph')}>PH</button>
                <button onClick={() => handleDatasetChange('No2')}>No2</button>
                <button onClick={() => handleDatasetChange('No3')}>No3</button>
                <button onClick={() => handleDatasetChange('GH')}>GH</button>
                <button onClick={() => handleDatasetChange('KH')}>KH</button>
            </div>
        </div>
    );
};

export default AquariumDetails;
