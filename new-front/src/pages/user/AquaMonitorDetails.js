import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LineChartComponent from '../../components/LineChart';
import '../../CSS/AquaMonitorDetails.css';
import { fetchAquariumData } from '../../components/ApiConnector';

const AquariumDetails = () => {
    const { aquariumName } = useParams();
    const navigate = useNavigate();
    const [aquariumData, setAquariumData] = useState({});
    const [selectedDataset, setSelectedDataset] = useState('temperature');
    const [chartData, setChartData] = useState([]);

    const filterData = (data, desiredOutput) => {
        // possible outputs: temperature, ph, No2, No3, GH, KH
        let output = [];
        //iterate over data.history
        data.history.forEach((entry) => {
            let filteredEntry = {
                date: entry.date,
                value: entry[desiredOutput],
            };
            output.push(filteredEntry);
            });
        return output;
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                let data = await fetchAquariumData(aquariumName);
                console.log("Raw data:", data); // Log the raw data

                if (data) {
                    setAquariumData(data);
                    let filtered_data = filterData(data, selectedDataset);
                    setChartData(filtered_data);
                    console.log("Filtered data: ", filtered_data);
                } else {
                    console.log("No data retrieved");
                }
            } catch (error) {
                console.error("Error processing aquarium data:", error);
            }
        };

        fetchData();
    }, [aquariumName, selectedDataset]);

    const handleDatasetChange = (dataset) => {
        setSelectedDataset(dataset);
        //setChartData(aquarium[dataset]);
    };

    return (
        <div className="aquamonitor">
            <div className="aquamonitor-details">
                <h1>AquaMonitor</h1>
                <h2>Aquarium: {aquariumName}</h2>
                <button onClick={() => navigate(-1)}>Go Back</button>
                <LineChartComponent data={chartData} selectedDataset={selectedDataset} />
            </div>
            <div className="aquamonitor-controls">
                <div className="control-box">
                    <h3>Control Buttons</h3>
                    <button className={selectedDataset === 'temperature' ? 'selected' : ''}
                            onClick={() => handleDatasetChange('temperature')}>
                        Temperature
                    </button>
                    <button className={selectedDataset === 'ph' ? 'selected' : ''} onClick={() => handleDatasetChange('ph')}>
                        PH
                    </button>
                    <button className={selectedDataset === 'No2' ? 'selected' : ''}
                            onClick={() => handleDatasetChange('No2')}>
                        No2
                    </button>
                    <button className={selectedDataset === 'No3' ? 'selected' : ''}
                            onClick={() => handleDatasetChange('No3')}>
                        No3
                    </button>
                    <button className={selectedDataset === 'GH' ? 'selected' : ''} onClick={() => handleDatasetChange('GH')}>
                        GH
                    </button>
                    <button className={selectedDataset === 'KH' ? 'selected' : ''} onClick={() => handleDatasetChange('KH')}>
                        KH
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AquariumDetails;
