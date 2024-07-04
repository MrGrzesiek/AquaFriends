import React from "react";
import {useParams} from "react-router-dom";

const AquaLifeDetails = () => {
    const {aquariumName} = useParams();
    return (
        <div>
            <h1>Ryby w {aquariumName}</h1>
        </div>
    );
}

export default AquaLifeDetails;