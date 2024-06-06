import React, { useState, useEffect } from 'react';
import { fetchSpeciesData, fetchSpeciesPhoto } from "./ApiConnector";
import "./../CSS/FishGallery.css"; // Zaimportuj plik CSS dla galerii

const FishGallery = () => {
    const [fishData, setFishData] = useState([]);
    const [selectedFish, setSelectedFish] = useState(null);
    const [selectedFishPhoto, setSelectedFishPhoto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchSpeciesData();
                setFishData(data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleFishClick = async (fish) => {
        setSelectedFish(fish);
        try {
            const token = localStorage.getItem("authToken");
            const tokenObj = JSON.parse(token);
            const photoUrl = await fetchSpeciesPhoto(fish.name, tokenObj.access_token);
            setSelectedFishPhoto(photoUrl);
        } catch (error) {
            console.error("Error fetching species photo:", error);
            setSelectedFishPhoto(null);
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    if (loading) {
        return <div className="loading">Ładowanie...</div>;
    }

    if (error) {
        return <div className="error">Błąd: {error.message}</div>;
    }

    // Filtruj listę gatunków na podstawie wyszukiwanego terminu
    const filteredFishData = fishData.filter((fish) =>
        fish.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fish-gallery">
            <div className="fish-list">
                <h2>Lista gatunków</h2>
                <input
                    type="text"
                    placeholder="Szukaj gatunku..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <ul className="species-list">
                    {filteredFishData.map(fish => (
                        <li
                            key={fish._id}
                            onClick={() => handleFishClick(fish)}
                            className={selectedFish && selectedFish._id === fish._id ? 'selected' : ''}
                        >
                            {fish.name}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="fish-details">
                <h2>Szczegóły gatunku</h2>
                {selectedFish ? (
                    <div className="fish-card">
                        <h2>{selectedFish.name}</h2>
                        <p><b>Opis</b></p>
                        <p>{selectedFish.description}</p>
                        <p><b>Temperatura: </b>{selectedFish.min_temp}°C - {selectedFish.max_temp}°C</p>
                        <p><b>pH: </b>{selectedFish.min_ph} - {selectedFish.max_ph}</p>
                        <p><b>Zasolenie: </b>{selectedFish.min_salinity}% - {selectedFish.max_salinity}%</p>
                        {selectedFishPhoto ? (
                            <img src={selectedFishPhoto} alt={`Zdjęcie ${selectedFish.name}`} className="fish-photo"/>
                        ) : (
                            <div>Brak zdjęcia dla tego gatunku.</div>
                        )}
                    </div>
                ) : (
                    <div className="no-selection">Wybierz gatunek z listy po lewej stronie, aby zobaczyć szczegóły.</div>
                )}
            </div>
        </div>
    );
};

export default FishGallery;

