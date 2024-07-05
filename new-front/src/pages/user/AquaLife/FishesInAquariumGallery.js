import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { fetchSpeciesData, fetchSpeciesPhoto, fetchAquariumData } from "../../../components/ApiConnector";
import "./../../../CSS/AquaLifeFishGallery.css";
import QuantityInput from "./NumberInput";
import {useParams} from "react-router-dom";

const FishesInAquariumGallery = forwardRef(({ onQuantityChange, aquariumName, fishSpecies, aquariumData, loading, error }, ref) => {


    useEffect(() => {
    }, []);

    useImperativeHandle(ref, () => ({
        getFishData: () => fishSpecies,
    }));

    const getFishPhotoUrl = (speciesName) => {
        console.log("getFishPhotoUrl: ", speciesName)
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
