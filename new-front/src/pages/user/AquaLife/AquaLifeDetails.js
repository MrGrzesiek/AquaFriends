import React, {useState, useRef, useEffect} from "react";
import { useParams } from "react-router-dom";
import AquaLifeSpeciesGallery from "./AquaLifeSpeciesGallery";
import Button from "@mui/material/Button";
import {
    fetchAquariumData,
    fetchSpeciesData,
    fetchSpeciesPhoto,
    removeFishFromAquarium
} from "../../../components/ApiConnector";
import FishesInAquariumGallery from "./FishesInAquariumGallery";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Snackbar from '@mui/base/Snackbar';
import WarningSnackbar from "./WarningsSnackbar";


const getConflictingFish = (aquariumData, allSpecies) => {
    console.log("Aquarium data: ", aquariumData)
    console.log("All species: ", allSpecies)
    const conflictingFish = [];
    if (aquariumData && allSpecies) {
        const allSpeciesNamesInAquarium = aquariumData.fishes.map(fish => fish.species_name);
        allSpecies = allSpecies.filter(species => allSpeciesNamesInAquarium.includes(species.name))
        console.log("Filtered species: ", allSpecies)
        aquariumData.fishes.forEach(fish => {
            const currentSpecie = allSpecies.find(species => species.name === fish.species_name);
            if (currentSpecie) {
                const dislikedSpeciesIds = currentSpecie.disliked_species ? currentSpecie.disliked_species : [];
                const conflicts = allSpecies.filter(species => dislikedSpeciesIds.includes(species._id));
                if (conflicts.length > 0) {
                    console.log("Conflicts: ", conflicts)
                }
                conflicts.forEach(conflict => {
                    if (!conflictingFish.some(pair => pair.includes(fish.species_name) && pair.includes(conflict.name))) {
                        console.log("Conflict: ", fish.fish_name, conflict.name)
                        conflictingFish.push([fish.species_name, conflict.name]);
                    }
                });
            }
        });
    }
    console.log("Final result: ", conflictingFish)
    return conflictingFish.length > 0 ? conflictingFish : null;
}


const AquaLifeDetails = () => {
    const { aquariumName } = useParams();
    const [isSaveEnabled, setIsSaveEnabled] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const galleryRef = useRef(null);

    /* FishesInAquariumGaller data management */
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
            const debug = aquarium.history[aquarium.history.length - 1];
            setAquariumData(debug); // The last element of the array is the most recent data
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    };

    const handleDeleteFish = async (index) => {
        const updatedFishes = [...aquariumData.fishes];
        const removedFishName = updatedFishes[index].fish_name;
        updatedFishes.splice(index, 1); // Remove fish at index
        try {
            // Assuming updateFishesInAquarium is a function that updates the aquarium data
            await removeFishFromAquarium(aquariumName, removedFishName);
            setAquariumData({ ...aquariumData, fishes: updatedFishes });
            setIsSaveEnabled(true);
            fetchData();
        } catch (error) {
            console.error("Error deleting fish:", error);
        }
    };

    const handleCloseModal = async () => {
        setIsModalOpen(false);
        fetchData();
    };

    const handleNewFishesButton = async () => {
        setIsModalOpen(true);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <h1>Ryby w {aquariumName}</h1>
            <Button
                variant="contained"
                color="primary"
                onClick={handleNewFishesButton}
                disabled={false}
                style={{ marginTop: "20px" }}
            >
                Dodaj nowe ryby
            </Button>
            <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '90%',
                        height: '90%',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        overflow: 'auto', // This ensures that the modal content is scrollable
                    }}
                >
                    <AquaLifeSpeciesGallery ref={galleryRef} aquariumName={aquariumName}  />
                </Box>
            </Modal>
            <FishesInAquariumGallery aquariumName={aquariumName} fishSpecies={fishSpecies} aquariumData={aquariumData} loading={loading} error={error} onDeleteFish={handleDeleteFish}/>
            <WarningSnackbar conflictingFishes={getConflictingFish(aquariumData, fishSpecies)}/>
        </div>
    );
};
//<AquaLifeSpeciesGallery ref={galleryRef} aquariumName={aquariumName} onQuantityChange={handleQuantityChange} />

export default AquaLifeDetails;
