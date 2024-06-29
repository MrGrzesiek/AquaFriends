import React from "react";
import { fetchUserAquariums } from "../../components/ApiConnector";
import Header from "../../components/nav/Header";
import "../../CSS/AquariumsList.css";

const aquariumImages = [
    "https://t4.ftcdn.net/jpg/08/55/11/41/240_F_855114111_T2vF7DTpQRywn2zTXbR8rxoljorBRS7M.jpg",
    "https://t4.ftcdn.net/jpg/06/02/46/43/240_F_602464374_AMjoeoJh9Lu4bx8bPqGXDHHUmhdmyWdn.jpg",
    "https://t4.ftcdn.net/jpg/08/17/58/45/240_F_817584583_ciRKqkYzyHlha8OZ5zhIBgto66QkfMSy.jpg",
    "https://t3.ftcdn.net/jpg/05/87/76/90/240_F_587769041_MyiMZNZzEZmG4kfMD8sjE0sV0IEs4qi3.jpg",
    "https://t4.ftcdn.net/jpg/06/97/25/15/240_F_697251598_BedwFNC2LxvUtHiYHNuNA2g7Bgltr2VM.jpg",
    "https://t4.ftcdn.net/jpg/07/46/57/23/240_F_746572330_1dczWonk3C73afxNLNCxPMEmailgzfKV.jpg",
    "https://t3.ftcdn.net/jpg/07/14/62/36/240_F_714623603_qtNAtLWCAncwPbXcT7hcdeoTHs07Yxpl.jpg",
    "https://t4.ftcdn.net/jpg/06/66/07/69/240_F_666076970_aXEsoAhwgjBzUNNubuz7NXBS9Q13FlGa.jpg"
];

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

    const handleBoxClick = (aquariumId) => {
        // Navigate to the aquarium's details page
        // Assuming you have a router set up for aquarium details
        window.location.href = `/aquarium/${aquariumId}`;
    };

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
                {aquariums.map((aquarium, index) => (
                    <div
                        key={aquarium.id}
                        className="aquarium-box"
                        onClick={() => handleBoxClick(aquarium.id)}
                    >
                        <img
                            src={aquariumImages[index % aquariumImages.length]}
                            alt={aquarium.name}
                            className="aquarium-image"
                        />
                        <h2>{aquarium.name}</h2>
                        <p>{aquarium.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AquariumsList;
