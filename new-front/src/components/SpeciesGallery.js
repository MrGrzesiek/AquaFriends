import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { fetchSpeciesData, fetchSpeciesPhoto, deleteSpecies, updateSpeciesData } from "./ApiConnector";
import "./../CSS/FishGallery.css";

const FishGallery =  forwardRef((props, ref) => {
    const [fishData, setFishData] = useState([]);
    const [selectedFish, setSelectedFish] = useState(null);
    const [selectedFishPhoto, setSelectedFishPhoto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await fetchSpeciesData();
            setFishData(data);
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
    }));

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

    const handleDelete = async () => {
        if (selectedFish) {
            const confirmDelete = window.confirm(`Czy na pewno chcesz usunąć gatunek ${selectedFish.name}?`);
            if (confirmDelete) {
                setIsDeleting(true);
                try {
                    await deleteSpecies(selectedFish.name);
                    alert(`Gatunek ${selectedFish.name} został usunięty.`);
                    fetchData(); // Refresh the list after deletion
                } catch (error) {
                    console.error("Error deleting species:", error);
                    alert("Wystąpił błąd podczas usuwania gatunku.");
                } finally {
                    setIsDeleting(false);
                }
            }
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleDislikedSpeciesChange = async (newDislikedSpecies) => {
        if (selectedFish) {
            try {
                const updatedSelectedFish = {
                    ...selectedFish,
                    disliked_species: newDislikedSpecies,
                };
                console.log(updatedSelectedFish)
                await updateSpeciesData(updatedSelectedFish, "PUT");
                setSelectedFish(updatedSelectedFish);
                alert(`Konflikty dla ${selectedFish.name} zostały zaktualizowane.`);
                props.onSubmit();
                console.log("Updated disliked_species:", newDislikedSpecies);
            } catch (error) {
                console.error("Error updating disliked_species:", error);
            }
        }
    };

    if (loading) {
        return <div className="loading">Ładowanie...</div>;
    }

    if (error) {
        return <div className="error">Błąd: {error.message}</div>;
    }

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
                        <br></br>
                        <button onClick={handleDelete} disabled={isDeleting} className="delete-button">
                            {isDeleting ? "Usuwanie..." : "Usuń gatunek"}
                        </button>
                        <div className="multi-select-section">
                            <MultiSelectTwoPanel 
                                availableItems={filteredFishData} 
                                selectedFish={selectedFish} 
                                onDislikedSpeciesChange={handleDislikedSpeciesChange} 
                            />
                        </div>
                    </div>
                ) : (
                    <div className="no-selection">Wybierz gatunek z listy po lewej stronie, aby zobaczyć szczegóły.</div>
                )}
            </div>
        </div>
    );
});

export default FishGallery;

const MultiSelectTwoPanel = ({ availableItems, selectedFish, onDislikedSpeciesChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTermSelected, setSearchTermSelected] = useState('');
    const [selectedItems, setSelectedItems] = useState(
    availableItems.filter(item => selectedFish.disliked_species.includes(item._id))
  );

  useEffect(() => {
    setSelectedItems(
      availableItems.filter(item => selectedFish.disliked_species.includes(item._id))
    );
  }, [selectedFish, availableItems]);

  const handleSelectItem = (item) => {
    const updatedSelectedItems = [...selectedItems, item];
    setSelectedItems(updatedSelectedItems);
  };

  const handleDeselectItem = (item) => {
    const updatedSelectedItems = selectedItems.filter(i => i._id !== item._id);
    setSelectedItems(updatedSelectedItems);
  };

  const handleLogDislikedSpecies = async () => {
    try {
      const updatedDislikedSpecies = selectedItems.map(item => item._id);
      await onDislikedSpeciesChange(updatedDislikedSpecies);
      console.log("Disliked Species IDs:", updatedDislikedSpecies);
    } catch (error) {
      console.error("Error logging disliked species:", error);
    }
  };

  const filteredAvailableItems = availableItems.filter(item =>
    !selectedItems.some(selected => selected._id === item._id) &&
    item._id !== selectedFish._id &&
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSelectedItems = selectedItems.filter(item =>
    item.name.toLowerCase().includes(searchTermSelected.toLowerCase())
  );

  return (
    <div className="panelborder">
        <h2>Menadżer konfliktów</h2>
        <div className="multi-select-two-panel">
            <div className="panel">
                <h3>Gatunki neutralne</h3>
                <input
                    type="text"
                    placeholder="Szukaj..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <ul>
                    {filteredAvailableItems.map(item => (
                    <li key={item._id}>
                        <span>{item.name}</span>
                        <button onClick={() => handleSelectItem(item)}>Wybierz</button>
                    </li>
                    ))}
                </ul>
            </div>
            <div className="panel">
                <h3>Gatunki konfliktowe</h3>
                <input
                    type="text"
                    placeholder="Szukaj..."
                    value={searchTermSelected}
                    onChange={(e) => setSearchTermSelected(e.target.value)}
                />
                <ul>
                    {filteredSelectedItems.map(item => (
                    <li key={item._id}>
                        <span>{item.name}</span>
                        <button onClick={() => handleDeselectItem(item)}>Odznacz</button>
                    </li>
                    ))}
                </ul>
            </div>
            </div>
    <button className="log-button" onClick={handleLogDislikedSpecies}>Zapisz</button>
    </div>
  );
};
