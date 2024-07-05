import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import AquaLifeSpeciesGallery from "./AquaLifeSpeciesGallery";
import Button from "@mui/material/Button";
import { updateFishesInAquarium } from "../../../components/ApiConnector";
import FishesInAquariumGallery from "./FishesInAquariumGallery";

const AquaLifeDetails = () => {
    const { aquariumName } = useParams();
    const [isSaveEnabled, setIsSaveEnabled] = useState(false);
    const galleryRef = useRef(null);

    const handleQuantityChange = () => {
        setIsSaveEnabled(true);
    };

    const handleSave = async () => {
        if (galleryRef.current) {
            const fishData = galleryRef.current.getFishData();
            try {
                await updateFishesInAquarium(aquariumName, fishData);
                alert("Dane ryb zostały zapisane.");
                setIsSaveEnabled(false);
            } catch (error) {
                console.error("Error updating fishes:", error);
                alert("Wystąpił błąd podczas zapisywania danych ryb.");
            }
        }
    };

    return (
        <div>
            <h1>Ryby w {aquariumName}</h1>
            <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={false}
                style={{ marginTop: "20px" }}
            >
                Dodaj nowe ryby
            </Button>
            <FishesInAquariumGallery aquariumName={aquariumName}/>
        </div>
    );
};
//<AquaLifeSpeciesGallery ref={galleryRef} aquariumName={aquariumName} onQuantityChange={handleQuantityChange} />

export default AquaLifeDetails;
