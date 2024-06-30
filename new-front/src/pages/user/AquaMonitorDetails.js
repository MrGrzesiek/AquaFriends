import React from 'react';
import { useParams } from 'react-router-dom';

const AquariumDetails = () => {
    const { id } = useParams();

    // Replace this with actual fetching logic
    const aquarium = {
        id,
        name: `Aquarium ${id}`,
        description: `Details of Aquarium ${id}`
    };

    return (
        <div>
            <h2>{aquarium.name}</h2>
            <p>{aquarium.description}</p>
        </div>
    );
};

export default AquariumDetails;
