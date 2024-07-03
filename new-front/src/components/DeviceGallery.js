import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { getAllDevice, deleteDevice } from "./ApiConnector"; // Zmiana nazwy funkcji na bardziej adekwatną
import "./../CSS/FishGallery.css";

const DeviceGallery = forwardRef((props, ref) => {
    const [deviceData, setDeviceData] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState(""); // Nowy stan dla wybranego typu
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getAllDevice();
            setDeviceData(data);
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

    const handleDeviceClick = (device) => {
        setSelectedDevice(device);
    };

    const handleDelete = async () => {
        if (selectedDevice) {
            const confirmDelete = window.confirm(`Czy na pewno chcesz usunąć urządzenie ${selectedDevice.name}?`);
            if (confirmDelete) {
                setIsDeleting(true);
                try {
                    await deleteDevice(selectedDevice._id); // Użyjemy ID zamiast nazwy
                    alert(`Urządzenie ${selectedDevice.name} zostało usunięte.`);
                    fetchData();
                } catch (error) {
                    console.error("Error deleting device:", error);
                    alert("Wystąpił błąd podczas usuwania urządzenia.");
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

    const filteredDeviceData = deviceData.filter((device) => {
        const matchesSearchTerm = device.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedType ? device.type === selectedType : true;
        return matchesSearchTerm && matchesType;
    });

    return (
        <div className="fish-gallery">
            <div className="fish-list">
                <h2>Lista urządzeń</h2>
                <input
                    type="text"
                    placeholder="Szukaj urządzenia..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <select value={selectedType} onChange={handleTypeChange}>
                    <option value="">Wszystkie typy</option>
                    <option value="Pump">Pompa</option>
                    <option value="Heater">Grzałka</option>
                    <option value="Filter">Filtr</option>
                    <option value="Light">Oświetlenie</option>
                </select>
                <ul className="species-list">
                    {filteredDeviceData.map(device => (
                        <li
                            key={device._id}
                            onClick={() => handleDeviceClick(device)}
                            className={selectedDevice && selectedDevice._id === device._id ? 'selected' : ''}
                        >
                            {device.name}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="fish-details">
                <h2>Szczegóły urządzenia</h2>
                {selectedDevice ? (
                    <div className="fish-card">
                        <h2>{selectedDevice.name}</h2>
                        <p><b>Opis: </b>{selectedDevice.description}</p>
                        <p><b>Typ: </b>{selectedDevice.type}</p>
                        <p><b>Moc: </b>{selectedDevice.power} W</p>
                        <p><b>Minimalna objętość: </b>{selectedDevice.minV} L</p>
                        <p><b>Maksymalna objętość: </b>{selectedDevice.maxV} L</p>
                        <p><b>Sprawność: </b>{selectedDevice.efficiency} %</p>
                        {selectedDevice.type === "Pump" && (
                            <p><b>Przepływ: </b>{selectedDevice.flow} L/min</p>
                        )}
                        {selectedDevice.type === "Light" && (
                            <>
                                <p><b>Luminancja: </b>{selectedDevice.luminance} lm</p>
                                <p><b>Jasność: </b>{selectedDevice.brightness} %</p>
                                <p><b>Kolor: </b>
                                    <div
                                        style={{
                                            display: 'inline-block',
                                            width: '20px',
                                            height: '20px',
                                            backgroundColor: selectedDevice.color,
                                            border: '1px solid #000',
                                            verticalAlign: 'middle'
                                        }}
                                        title={selectedDevice.color} // Wyświetla wartość koloru jako podpowiedź
                                    ></div>
                                </p>
                            </>
                        )}
                        {selectedDevice.type === "Filter" && (
                            <>
                                <p><b>Typ filtra: </b>{selectedDevice.filter_type}</p>
                                <p><b>Maksymalny przepływ: </b>{selectedDevice.flow_max} L/min</p>
                            </>
                        )}
                        {selectedDevice.type === "Heater" && (
                            <>
                                <p><b>Minimalna temperatura: </b>{selectedDevice.min_temp} °C</p>
                                <p><b>Maksymalna temperatura: </b>{selectedDevice.max_temp} °C</p>
                            </>
                        )}
                        <br />
                        <button onClick={handleDelete} disabled={isDeleting} className="delete-button">
                            {isDeleting ? "Usuwanie..." : "Usuń urządzenie"}
                        </button>
                    </div>
                ) : (
                    <div className="no-selection">Wybierz urządzenie z listy po lewej stronie, aby zobaczyć szczegóły.</div>
                )}
            </div>
        </div>
    );
});

export default DeviceGallery;
