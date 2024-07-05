import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AquariumsList from "../AquariumsList";
import AquaHistoryRender from './AquaHistoryRender'; // Import the component

const AquaHistory = () => {
    return (
        <div>
            <Routes>
                <Route path="/" element={<AquariumsList />} />
                <Route path=":aquariumName" element={<AquaHistoryRender />} /> {/* Define the route */}
            </Routes>
        </div>
    );
};

export default AquaHistory;