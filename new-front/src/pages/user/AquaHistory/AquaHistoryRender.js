import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAquariumEvents, getAquariumHistory } from '../../../components/ApiConnector'; // Adjust this import path as per your project structure
import "../../../CSS/HistoryStyle.css"

// Function to generate change logs from entries
function generateChangeLogs(entries) {
    let logs = [];

    // Function to compare two entries and generate changes
    function compareEntries(a, b) {
        let changes = [];

        // Compare top-level properties
        for (let key in a) {
            if (key in b) {
                // Handle specific properties
                if (
                    ["temperature", "ph", "No2", "No3", "GH", "KH"].includes(key) ||
                    ["height", "width", "length"].includes(key)
                ) {
                    if (a[key] !== b[key]) {
                        changes.push(`Changed ${key} from ${a[key]} to ${b[key]}`);
                    }
                } else if (["pump", "heater", "luminance", "decorations"].includes(key)) {
                    if (JSON.stringify(a[key]) !== JSON.stringify(b[key])) {
                        changes.push(`Added/Updated ${key}: ${JSON.stringify(b[key])}`);
                    }
                } else if (key === "date") {
                    if (a[key] !== b[key]) {
                        changes.push(`Updated date to ${b[key]}`);
                    }
                } else if (key === "fishes") {
                    // Handle arrays like 'fishes'
                    let fishChanges = compareFishArray(a[key], b[key]);
                    if (fishChanges.length > 0) {
                        changes.push({ fishes: fishChanges });
                    }
                } else if (typeof a[key] === "object" && typeof b[key] === "object") {
                    // Handle nested objects
                    let nestedChanges = compareEntries(a[key], b[key]);
                    if (nestedChanges.length > 0) {
                        changes.push({ [key]: nestedChanges });
                    }
                } else {
                    // Default case for simple property changes
                    if (a[key] !== b[key]) {
                        changes.push(`Changed ${key} from ${a[key]} to ${b[key]}`);
                    }
                }
            } else {
                changes.push(`Removed ${key}`);
            }
        }

        // Check for new properties in b
        for (let key in b) {
            if (!(key in a)) {
                changes.push(`Added ${key}: ${b[key]}`);
            }
        }

        return changes;
    }

    // Function to compare 'fishes' arrays
    function compareFishArray(a, b) {
        let fishChanges = [];

        // Compare fish objects in the array
        for (let i = 0; i < Math.min(a.length, b.length); i++) {
            let fishA = a[i];
            let fishB = b[i];
            if (JSON.stringify(fishA) !== JSON.stringify(fishB)) {
                fishChanges.push(`Changed fish ${fishA.fish_name}: ${JSON.stringify(fishB)}`);
            }
        }

        // Check for removed fish
        for (let i = Math.min(a.length, b.length); i < a.length; i++) {
            fishChanges.push(`Removed fish ${a[i].fish_name}`);
        }

        // Check for added fish
        for (let i = Math.min(a.length, b.length); i < b.length; i++) {
            fishChanges.push(`Added fish ${b[i].fish_name}: ${JSON.stringify(b[i])}`);
        }

        return fishChanges;
    }

    // Generate logs for each pair of consecutive entries
    for (let i = 0; i < entries.length - 1; i++) {
        let changes = compareEntries(entries[i], entries[i + 1]);

        // Check if water parameters changed
        let waterParamsChanged = changes.some(change => {
            if (typeof change === "string" && ["temperature", "ph", "No2", "No3", "GH", "KH"].some(param => change.includes(param))) {
                return true;
            } else if (typeof change === "object" && change.hasOwnProperty("water_params")) {
                return true;
            }
            return false;
        });

        if (waterParamsChanged) {
            changes.push("Updated water parameters");
        }

        logs.push({
            date: entries[i + 1].date,
            changes: changes
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
        const fetchHistory = async () => {
            try {
                const eventsData = await getAquariumEvents(aquariumName);
                const historyData = await getAquariumHistory(aquariumName);
                const formattedHistory = generateChangeLogs(historyData.history);
                setHistory(formattedHistory);
                console.log(historyData)
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchHistory();
    }, [aquariumName]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="history-container">
        <h1>History for {aquariumName}</h1>
        <ul className="history-list">
            {history.map((item, index) => (
                <li key={index} className="history-item">
                    <div className="history-date"><strong>Date:</strong> {item.date}</div>
                    <ul className="change-list">
                        {item.changes.map((change, idx) => (
                            <li key={idx} className="change-item">
                                {typeof change === 'string' ? (
                                    change
                                ) : (
                                    Object.keys(change).map((key, subIdx) => (
                                        <div key={subIdx} className="nested-change">
                                            <strong>{key}:</strong>
                                            <ul className="sub-change-list">
                                                {change[key].map((subChange, subIdx2) => (
                                                    <li key={subIdx2} className="sub-change-item">{subChange}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))
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
