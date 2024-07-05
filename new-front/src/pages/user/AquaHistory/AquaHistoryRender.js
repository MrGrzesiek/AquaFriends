import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAquariumEvents, getAquariumHistory } from '../../../components/ApiConnector'; // Adjust this import path as per your project structure
import "../../../CSS/HistoryStyle.css"

function generateChangeLogs(entries) {
    let logs = [];

    // Funkcja do porównywania dwóch wpisów i generowania zmian
    function compareEntries(a, b, isFirstChange = false) {
        let changes = [];

        // Porównanie właściwości na najwyższym poziomie
        for (let key in a) {
            if (key in b && key !== "date") {
                // Obsługa konkretnych właściwości
                if (
                    ["temperature", "ph", "No2", "No3", "GH", "KH"].includes(key) ||
                    ["height", "width", "length"].includes(key)
                ) {
                    if (a[key] !== b[key]) {
                        changes.push(`Zmieniono ${key} z ${a[key]} na ${b[key]}`);
                    }
                } else if (["pump", "heater", "luminance", "decorations"].includes(key)) {
                    if (JSON.stringify(a[key]) !== JSON.stringify(b[key])) {
                        changes.push(`Dodano/Zaktualizowano ${key}: ${JSON.stringify(b[key])}`);
                    }
                } else if (key === "fishes") {
                    // Obsługa tablicy 'fishes'
                    let fishChanges = compareFishArray(a[key], b[key]);
                    if (fishChanges.length > 0) {
                        changes.push({ fishes: fishChanges });
                    }
                } else if (typeof a[key] === "object" && typeof b[key] === "object") {
                    // Obsługa zagnieżdżonych obiektów
                    let nestedChanges = compareEntries(a[key], b[key]);
                    if (nestedChanges.length > 0) {
                        changes.push({ [key]: nestedChanges });
                    }
                } else {
                    // Domyślny przypadek dla prostych zmian właściwości
                    if (a[key] !== b[key]) {
                        changes.push(`Zmieniono ${key} z ${a[key]} na ${b[key]}`);
                    }
                }
            } else {
                if (key !== "date") {
                    changes.push(`Usunięto ${key}`);
                }
            }
        }

        // Sprawdzenie nowych właściwości w b
        for (let key in b) {
            if (!(key in a)) {
                changes.push(`Dodano ${key}: ${b[key]}`);
            }
        }

        return changes;
    }

    // Funkcja do porównywania tablicy 'fishes'
    function compareFishArray(a, b) {
        let fishChanges = [];

        // Porównanie obiektów ryb w tablicy
        for (let i = 0; i < Math.min(a.length, b.length); i++) {
            let fishA = a[i];
            let fishB = b[i];
            let fishChange = [];

            // Porównanie każdej właściwości obiektu ryby
            for (let key in fishA) {
                if (fishA[key] !== fishB[key]) {
                    fishChange.push(`Zmieniono ${key} z ${fishA[key]} na ${fishB[key]}`);
                }
            }

            if (fishChange.length > 0) {
                fishChanges.push({ fish_name: fishA.fish_name, changes: fishChange });
            }
        }

        // Sprawdzenie usuniętych ryb
        for (let i = Math.min(a.length, b.length); i < a.length; i++) {
            fishChanges.push(`Usunięto rybę ${a[i].fish_name}`);
        }

        // Sprawdzenie dodanych ryb
        for (let i = Math.min(a.length, b.length); i < b.length; i++) {
            fishChanges.push(`Dodano rybę ${b[i].fish_name}`);
        }

        return fishChanges;
    }

    // Generowanie logów dla każdej pary kolejnych wpisów
    for (let i = 0; i < entries.length - 1; i++) {
        let isFirstChange = i === 0;
        let changes = compareEntries(entries[i], entries[i + 1], isFirstChange);

        // Sprawdzenie, czy zmieniły się parametry wody
        let waterParamsChanged = changes.some(change => {
            if (typeof change === "string" && ["temperature", "ph", "No2", "No3", "GH", "KH"].some(param => change.includes(param))) {
                return true;
            } else if (typeof change === "object" && change.hasOwnProperty("water_params")) {
                return true;
            }
            return false;
        });

        if (waterParamsChanged) {
            changes.push("Zaktualizowano parametry wody");
        }

        logs.push({
            date: entries[i + 1].date,
            changes: changes.filter(change => {
                if (typeof change === "string" && change.startsWith("Zaktualizowano datę na ")) {
                    return false;
                }
                return true;
            })
        });
    }

    return logs;
}





const AquaHistoryRender = () => {
    const { aquariumName } = useParams();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getHistory = async () => {
            try {
                // Pobranie danych z API
                const data = await getAquariumEvents(aquariumName); // Załóżmy, że to funkcja pobierająca wydarzenia akwarium
                const data2 = await getAquariumHistory(aquariumName); // Załóżmy, że to funkcja pobierająca historię zmian akwarium

                // Formatowanie historii zmian
                const formattedHistory = generateChangeLogs(data2.history); // Użycie funkcji do generowania logów zmian

                // Ustawienie sformatowanej historii w stanie komponentu
                setHistory(formattedHistory);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        getHistory();
    }, [aquariumName]);

    // Renderowanie stanu ładowania
    if (loading) {
        return <div className="loading">Loading...</div>; // Użycie klasy CSS dla ładowania
    }

    // Renderowanie błędu
    if (error) {
        return <div className="error">Error: {error.message}</div>; // Użycie klasy CSS dla błędu
    }

    // Renderowanie głównego widoku historii zmian
    return (
        <div className="history-container"> {/* Użycie klasy CSS dla kontenera historii */}
            <h1>History for {aquariumName}</h1>
            <ul className="history-list"> {/* Użycie klasy CSS dla listy historii */}
                {history.map((item, index) => (
                    <li key={index} className="history-item"> {/* Użycie klasy CSS dla elementu historii */}
                        <div className="history-date"><strong>Date:</strong> {new Date(item.date).toLocaleString()}</div> {/* Użycie klasy CSS dla daty historii */}
                        <ul className="change-list"> {/* Użycie klasy CSS dla listy zmian */}
                            {item.changes.map((change, idx) => (
                                <li key={idx} className="change-item"> {/* Użycie klasy CSS dla elementu zmiany */}
                                    {typeof change === 'string' ? (
                                        change
                                    ) : (
                                        <div className="nested-change"> {/* Użycie klasy CSS dla zagnieżdżonych zmian */}
                                            {change.fishes ? (
                                                <strong>{change.fishes[0].fish_name}:</strong>
                                            ) : null}
                                            <ul className="sub-change-list"> {/* Użycie klasy CSS dla listy zagnieżdżonych zmian */}
                                                {change.fishes ? (
                                                    change.fishes.map((fishChange, subIdx) => (
                                                        <li key={subIdx} className="sub-change-item"> {/* Użycie klasy CSS dla elementu zagnieżdżonej zmiany */}
                                                            {typeof fishChange === 'string' ? fishChange : fishChange.changes[0]}
                                                        </li>
                                                    ))
                                                ) : null}
                                            </ul>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AquaHistoryRender;
