import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { fetchSpeciesData, fetchSpeciesPhoto, fetchAquariumData } from "../../../components/ApiConnector";
import "./../../../CSS/AquaLifeFishGallery.css";
import QuantityInput from "./NumberInput";
import {useParams} from "react-router-dom";

const FishesInAquariumGallery = forwardRef(({ onQuantityChange, aquariumName }, ref) => {
    const [fishSpecies, setFishSpecies] = useState([]);
    const [aquariumData, setAquariumData] = useState();
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
            console.log("Aquarium history in FishesInAquariumGallery: ", aquarium);
            console.log("History length: ", aquarium.history.length);
            const debug = aquarium.history[aquarium.history.length - 1];
            setAquariumData(debug); // The last element of the array is the most recent data
            console.log("Aquarium data in FishesInAquariumGallery: ", aquariumData);
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

    const getFishPhotoUrl = (speciesName) => {
        console.log("getFishPhotoUrl: ", speciesName)
        const debugSpeciesName = speciesName;
        const debugFishSpecies =  fishSpecies.find(fish => fish.name === speciesName);
        const fish = fishSpecies.find(fish => fish.name === speciesName);
        return fish ? fish.photoUrl : null;
    };


    if (loading) {
        return <div className="loading">Ładowanie...</div>;
    }

    if (error) {
        return <div className="error">Błąd: {error.message}</div>;
    }

    return (
        <div className="fish-gallery">
            {aquariumData.fishes.map((fish, index) => (
                <div key={index} className="fish-card">
                    {getFishPhotoUrl(fish.species_name) ? (
                        <img src={getFishPhotoUrl(fish.species_name)} alt={`Zdjęcie ${fish.species_name}`} className="fish-photo"/>
                    ) : (
                        <div>Brak zdjęcia dla tego gatunku.</div>
                    )}
                    <h2>{fish.fish_name}</h2>
                    <p>Gatunek: {fish.species_name}</p>
                    <p>Miesiąc urodzin: {fish.date_of_birth}</p>
                </div>
            ))}
        </div>
    );
});

export default FishesInAquariumGallery;
