import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { fetchSpeciesData, fetchSpeciesPhoto, fetchAquariumData, addNewFish } from "../../../components/ApiConnector";
import "./../../../CSS/AquaLifeFishGallery.css";
import { useParams } from "react-router-dom";
import { Snackbar } from '@mui/base/Snackbar';
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";


const FishConflictWarning = ({ fishData, aquariumData, allSpecies }) => {
    const [conflictingFish, setConflictingFish] = useState([]);

    useEffect(() => {
        console.log("Fish data in FishConflictWarning: ", fishData)
        console.log("Aquarium data in FishConflictWarning: ", aquariumData)
        console.log("All species in FishConflictWarning: ", allSpecies)
        // Get the species object of the current fish in question
        const currentSpecie = allSpecies.find(species => species.name === fishData.species_name);

        // Check if the current species is found
        if (!currentSpecie) {
            console.error(`Species not found: ${fishData.species_name}`);
            return;
        }
        console.log("Current species: ", currentSpecie)

        // Get the IDs of disliked species for the current fish species or an empty array if none
        const dislikedSpeciesIds = currentSpecie.disliked_species ? currentSpecie.disliked_species : [];
        console.log("Disliked species IDs: ", dislikedSpeciesIds)

        const dislikedSpeciesNames = dislikedSpeciesIds.map(id => allSpecies.find(species => species._id === id).name);

        for (let i = 0; i < dislikedSpeciesIds.length; i++) {
            console.log(dislikedSpeciesIds[i] + " == " + "6662016911887fabad09caf3 => " )
            console.log(dislikedSpeciesIds[i] == "6662016911887fabad09caf3");
        }
        // Find the species in the aquarium that are disliked by the current species
        const conflicts = allSpecies.filter(species => dislikedSpeciesIds.includes(species._id))

        console.log("Conflict: ", conflicts);
        setConflictingFish(conflicts);
    }, [fishData, aquariumData, allSpecies]);

    if (conflictingFish.length === 0) {
        return null;
    }
    else {
        return (
            <div>
                <b>Gatunki konfliktujące: </b>
                <ul>
                    {conflictingFish.map(fish => (
                        <li key={fish._id}>{fish.name}</li>
                    ))}
                </ul>
            </div>
        );
    }

}

const AquaLifeSpeciesGallery = forwardRef(({ aquariumName, aquarium }, ref) => {
    const [fishSpecies, setFishSpecies] = useState([]);
    const [aquariumData, setAquariumData] = useState(aquarium);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddFishModalOpen, setIsAddFishModalOpen] = useState(false);
    const [newFish, setNewFish] = useState({
        aquarium_name: aquariumName,
        fish_name: '',
        species_name: '',
        months_of_age: ''
    });

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
            let aquariumHistory = aquarium.history;
            let lastEntry = aquariumHistory[aquariumHistory.length - 1];
            setAquariumData(lastEntry); // The last element of the array is the most recent data
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

    const handleNewFishChange = (field, value) => {
        setNewFish((prevFish) => ({ ...prevFish, [field]: value }));
    };

    const handleAddFish = async () => {
        try {
            const response = await addNewFish(newFish);
            if (response.code !== 200) {
                console.warn("Error adding new fish:", response);
                window.alert("Wystąpił błąd podczas dodawania nowej ryby: \n" + response.message);
                return;
            } else {
                window.alert("Ryba została dodana pomyślnie.");
            }
            // Assuming addNewFish updates the UI automatically upon success
            setIsAddFishModalOpen(false);
            setNewFish({
                ...newFish,
                fish_name: '',
                months_of_age: ''
            });

        } catch (error) {
            console.error("Error adding new fish:", error);
            alert("Wystąpił błąd podczas dodawania nowej ryby.");
        }
    };

    const openAddFishModal = (speciesName) => {
        setNewFish({
            ...newFish,
            species_name: speciesName
        });
        setIsAddFishModalOpen(true);
    };

    const handleCloseAddFishModal = () => {
        setIsAddFishModalOpen(false);
        setNewFish({
            ...newFish,
            fish_name: '',
            months_of_age: ''
        });
    };

    if (loading) {
        return <div className="loading">Ładowanie...</div>;
    }

    if (error) {
        return <div className="error">Błąd: {error.message}</div>;
    }

    return (
        <div className="fish-gallery2">
            {fishSpecies.map((fish, index) => (
                <div key={fish._id} className="fish-card2">
                    <h2 className="fish_species_name">{fish.name}</h2>
                    <p><b>Opis</b></p>
                    <p>{fish.description}</p>
                    <p><b>Temperatura: </b>{fish.min_temp}°C - {fish.max_temp}°C</p>
                    <p><b>pH: </b>{fish.min_ph} - {fish.max_ph}</p>
                    <p><b>Zasolenie: </b>{fish.min_salinity}% - {fish.max_salinity}%</p>
                    {fish.photoUrl ? (
                        <img src={fish.photoUrl} alt={`Zdjęcie ${fish.name}`} className="fish-photo2"/>
                    ) : (
                        <div>Brak zdjęcia dla tego gatunku.</div>
                    )}
                    <div className="plus-button-container">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => openAddFishModal(/* Pass species name from fish card */ fish.name)}
                            style={{ borderRadius: '50%', width: '60px', height: '60px', minWidth: '60px', margin: '10px auto' }}
                        >
                            +
                        </Button>
                    </div>
                </div>
            ))}
            <Modal
                open={isAddFishModalOpen}
                onClose={handleCloseAddFishModal}
                aria-labelledby="add-fish-modal-title"
                aria-describedby="add-fish-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '50%',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                    }}
                >
                    <h2 id="add-fish-modal-title">Dodaj Nową Rybe</h2>
                    <p>Dodajesz rybę gatunku: {newFish.species_name}</p>
                    <FishConflictWarning fishData={newFish} aquariumData={aquariumData} allSpecies={fishSpecies}/>
                    <TextField
                        label="Nazwa Ryby"
                        value={newFish.fish_name}
                        onChange={(e) => handleNewFishChange('fish_name', e.target.value)}
                    />
                    <TextField
                        label="Wiek w Miesiącach"
                        type="number"
                        value={newFish.months_of_age}
                        onChange={(e) => handleNewFishChange('months_of_age', e.target.value)}
                    />
                    <Button variant="contained" color="primary" onClick={handleAddFish}>
                        Dodaj
                    </Button>
                </Box>
            </Modal>
        </div>
    );
});

export default AquaLifeSpeciesGallery;
