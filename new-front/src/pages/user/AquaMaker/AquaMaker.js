import {useEffect, useState} from "react";
import {fetchAquariumById} from "../../../components/ApiConnector";
import {useParams} from "react-router-dom";
import AquariumForm from "./AquariumForum";

const AquariumPage = () => {
    const { aquarium_id } = useParams();
    console.log(aquarium_id);
    const [initialData, setInitialData] = useState(null);
    const [loading, setLoading] = useState(true);
    const mode = aquarium_id ? 'edit' : 'create';
    console.log(aquarium_id);
    console.log(mode);
    useEffect(() => {
        if (mode === 'edit') {
            const fetchData = async () => {
                try {
                    const data = await fetchAquariumById(aquarium_id);
                    setInitialData(data);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching aquarium data:', error);
                    setLoading(false);
                }
            };

            fetchData();
        } else {
            setLoading(false);
        }
    }, [aquarium_id, mode]);

    if (loading) {
        return <div className="loading">Ładowanie...</div>;
    }

    return (
        <div>
            <AquariumForm initialData={initialData} mode={mode} />
        </div>
    );
};

export default AquariumPage;