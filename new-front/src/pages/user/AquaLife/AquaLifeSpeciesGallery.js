import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { fetchSpeciesData, fetchSpeciesPhoto, fetchAquariumData } from "../../../components/ApiConnector";
import "./../../../CSS/AquaLifeFishGallery.css";
import QuantityInput from "./NumberInput";
import {useParams} from "react-router-dom";

const AquaLifeSpeciesGallery = forwardRef(({ onQuantityChange, aquariumName }, ref) => {
    const [fishSpecies, setFishSpecies] = useState([]);
    const [aquariumData, setAquariumData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await fetchSpeciesData();
            const fishDataWithPhotos = await Promise.all(data.map(async (fish) => {
                try {
                    const token = localStorage.getItem("authToken");
                    const tokenObj = JSON.parse(token);
                    const photoUrl = await fetchSpeciesPhoto(fish.name, tokenObj.access_token);
                    return { ...fish, photoUrl, quantity: 0 }; // Add quantity property
                } catch (error) {
                    console.error("Error fetching species photo:", error);
                    return { ...fish, photoUrl: null, quantity: 0 }; // Add quantity property
                }
            }));
            setFishSpecies(fishDataWithPhotos);
        } catch (error) {
            setError(error);
            setLoading(false);
        }

        try {
            let aquarium = await fetchAquariumData(aquariumName);
            setAquariumData(aquarium[aquarium.length - 1]); // The last element of the array is the most recent data
            console.log("Aquarium data in AquaLifeSpeciesGallery: ", aquariumData);

            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useImperativeHandle(ref, () => ({
        fetchData,
        getFishData: () => fishSpecies,
    }));

    const handleQuantityChange = (index, newQuantity) => {
        const newFishData = [...fishSpecies];
        newFishData[index].quantity = newQuantity;
        setFishSpecies(newFishData);
        onQuantityChange();
    };

    if (loading) {
        return <div className="loading">Ładowanie...</div>;
    }

    if (error) {
        return <div className="error">Błąd: {error.message}</div>;
    }

    return (
        <div className="fish-gallery">
            {fishSpecies.map((fish, index) => (
                <div key={fish._id} className="fish-card">
                    <h2>{fish.name}</h2>
                    <p><b>Opis</b></p>
                    <p>{fish.description}</p>
                    <p><b>Temperatura: </b>{fish.min_temp}°C - {fish.max_temp}°C</p>
                    <p><b>pH: </b>{fish.min_ph} - {fish.max_ph}</p>
                    <p><b>Zasolenie: </b>{fish.min_salinity}% - {fish.max_salinity}%</p>
                    {fish.photoUrl ? (
                        <img src={fish.photoUrl} alt={`Zdjęcie ${fish.name}`} className="fish-photo"/>
                    ) : (
                        <div>Brak zdjęcia dla tego gatunku.</div>
                    )}
                    <QuantityInput
                        className="quantity-input-container"
                        defaultValue={fish.quantity}
                        onChange={(newQuantity) => handleQuantityChange(index, newQuantity)}
                    />
                </div>
            ))}
        </div>
    );
});

export default AquaLifeSpeciesGallery;
