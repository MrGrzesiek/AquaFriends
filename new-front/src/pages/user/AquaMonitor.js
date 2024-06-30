import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import LineChart from "../../components/LineChart";
import Header from "../../components/nav/Header";
import AquariumsList from "./AquariumsList";

const AquaMonitor = () => {
    const { aquariumId } = useParams();
    const location = useLocation();
    const origin = location.state?.origin;

    if (!aquariumId) {
        console.log("aquariumId is null")
        return <AquariumsList/>;
    }
    else {
        console.log("aquariumId is not null")
        return (
            <div>
                <Header/>
                <h1>AquaMonitor for Aquarium {aquariumId}</h1>
                <p>Origin: {origin}</p>
                {/* Display other relevant details */}
                <LineChart/>
            </div>
        );
    }
};

export default AquaMonitor;
