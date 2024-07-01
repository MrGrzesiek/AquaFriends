import React from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import LineChartComponent from "../../components/LineChart";
import "../../CSS/AquaMonitorDetails.css"

const AquariumDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Replace this with actual fetching logic
    const aquarium = {
        id,
        name: `Aquarium ${id}`,
    };

    return (
        <div className={"aquamonitor"}>
            <div className="aquamonitor-details">
                <h1>Aquarium Monitor Details</h1>
                <h2>Aquarium name: {aquarium.name}</h2>
                <button onClick={() => navigate(-1)}>Go Back</button>
                <LineChartComponent/>
            </div>
            <div className={"aquamonitor-controls"}>
            </div>
        </div>
    );
};

export default AquariumDetails;
