import React from 'react';
import {useParams, useLocation, Route, Routes} from 'react-router-dom';
import LineChart from "../../components/LineChart";
import Header from "../../components/nav/Header";
import AquariumsList from "./AquariumsList";
import AquariumDetails from "./AquaMonitorDetails";

const AquaMonitor = () => {
    const { aquariumId } = useParams();
    const location = useLocation();
    const origin = location.state?.origin;

    return (
        <div>
            <Routes>
                <Route path="/" element={<AquariumsList />} />
                <Route path=":id" element={<AquariumDetails />} />
            </Routes>
        </div>
    );
};

export default AquaMonitor;
