import React from "react";
import {Route, Routes, useParams} from "react-router-dom";
import AquariumsList from "../AquariumsList";
import AquaLifeDetails from "./AquaLifeDetails";


const AquaLife = () => {
    const {aquariumName} = useParams();
    return (
        <div>
            <Routes>
                <Route path=":aquariumName" element={<AquaLifeDetails />} />
            </Routes>
        </div>
    );
}

export default AquaLife;