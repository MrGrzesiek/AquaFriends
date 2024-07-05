import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { getAllWarning, deleteWarning } from "./ApiConnector"; // Use relevant API connector functions
import "./../CSS/FishGallery.css";

const ParameterGallery = forwardRef((props, ref) => {
    const [parameterData, setParameterData] = useState([]);
    const [selectedParameter, setSelectedParameter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState(""); // State for selected type
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getAllWarning();
            setParameterData(data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useImperativeHandle(ref, () => ({
        fetchData,
    }));

    const handleParameterClick = (parameter) => {
        setSelectedParameter(parameter);
    };

    const handleDelete = async () => {
        if (selectedParameter) {
            const confirmDelete = window.confirm(`Czy na pewno chcesz usunąć ostrzeżenie ${selectedParameter.warning_name}?`);
            if (confirmDelete) {
                setIsDeleting(true);
                try {
                    await deleteWarning(selectedParameter._id); // Use ID for deletion
                    alert(`Ostrzeżenie ${selectedParameter.warning_name} zostało usunięte.`);
                    fetchData();
                } catch (error) {
                    console.error("Error deleting warning:", error);
                    alert("Wystąpił błąd podczas usuwania ostrzeżenia.");
                } finally {
                    setIsDeleting(false);
                }
            }
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleTypeChange = (event) => {
        setSelectedType(event.target.value);
    };

    if (loading) {
        return <div className="loading">Ładowanie...</div>;
    }

    if (error) {
        return <div className="error">Błąd: {error.message}</div>;
    }

    const filteredParameterData = parameterData.filter((parameter) => {
        const matchesSearchTerm = parameter.warning_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedType ? parameter.parameter === selectedType : true;
        return matchesSearchTerm && matchesType;
    });

    return (
        <div className="fish-gallery">
            <div className="fish-list">
                <h2>Lista parametrów</h2>
                <input
                    type="text"
                    placeholder="Szukaj parametru..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <select value={selectedType} onChange={handleTypeChange}>
                    <option value="">Wszystkie parametry</option>
                    <option value="temperature">Temperatura</option>
                    <option value="ph">pH</option>
                    <option value="No2">NO2</option>
                    <option value="No3">NO3</option>
                    <option value="GH">GH</option>
                    <option value="KH">KH</option>
                </select>
                <ul className="species-list">
                    {filteredParameterData.map(parameter => (
                        <li
                            key={parameter._id}
                            onClick={() => handleParameterClick(parameter)}
                            className={selectedParameter && selectedParameter._id === parameter._id ? 'selected' : ''}
                        >
                            {parameter.warning_name}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="fish-details">
                <h2>Szczegóły ostrzeżenia</h2>
                {selectedParameter ? (
                    <div className="fish-card">
                        <h2>{selectedParameter.warning_name}</h2>
                        <p><b>Opis: </b>{selectedParameter.warning_description}</p>
                        <p><b>Parametr: </b>{selectedParameter.parameter}</p>
                        <p><b>Wartość minimalna: </b>{selectedParameter.min_value}</p>
                        <p><b>Wartość maksymalna: </b>{selectedParameter.max_value}</p>
                        <br />
                        <button onClick={handleDelete} disabled={isDeleting} className="delete-button">
                            {isDeleting ? "Usuwanie..." : "Usuń parametr"}
                        </button>
                    </div>
                ) : (
                    <div className="no-selection">Wybierz ostrzeżenie z listy po lewej stronie, aby zobaczyć szczegóły.</div>
                )}
            </div>
        </div>
    );
});

export default ParameterGallery;
