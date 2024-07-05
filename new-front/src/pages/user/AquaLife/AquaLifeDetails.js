import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import AquaLifeSpeciesGallery from "./AquaLifeSpeciesGallery";
import Button from "@mui/material/Button";
import { updateFishesInAquarium } from "../../../components/ApiConnector";
import FishesInAquariumGallery from "./FishesInAquariumGallery";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const AquaLifeDetails = () => {
    const { aquariumName } = useParams();
    const [isSaveEnabled, setIsSaveEnabled] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const galleryRef = useRef(null);

    const handleQuantityChange = () => {
        setIsSaveEnabled(true);
    };

    const handleCloseModal = async () => {
        setIsModalOpen(false);
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

    const handleNewFishesButton = async () => {
        setIsModalOpen(true);
    };

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
            <FishesInAquariumGallery aquariumName={aquariumName}/>
        </div>
    );
};
//<AquaLifeSpeciesGallery ref={galleryRef} aquariumName={aquariumName} onQuantityChange={handleQuantityChange} />

export default AquaLifeDetails;
