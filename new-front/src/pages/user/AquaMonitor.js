import React from "react";
import { fetchUserAquariums } from "../../components/ApiConnector";
import Header from "../../components/nav/Header";
import "../../CSS/AquariumsList.css";


const AquariumsList = () => {
    const [aquariums, setAquariums] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchUserAquariums();
                setAquariums(data || []); // Ensure data is an array
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="loading">Ładowanie...</div>;
    }

    if (error) {
        return <div className="error">Błąd: {error.message}</div>;
    }

    // return list of boxes with aquariums. Each box should contain aquarium name, description and a button to navigate to the aquarium details page, as well as have a thin black outline
    // boxes should be stacked horizontally, and if width of the page is too small, they should wrap to the next line
    return (
        <div>
            <Header />
            <h1>Akwarium</h1>
            <div className="aquarium-container">
                {aquariums.map(aquarium => (
                    <div key={aquarium.id} className="aquarium-box">
                        <h2>{aquarium.name}</h2>
                        <p>{aquarium.description}</p>
                        <button>Przejdź do akwarium</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AquariumsList;
