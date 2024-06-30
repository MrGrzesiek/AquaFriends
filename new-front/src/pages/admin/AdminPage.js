import React, { useState, useEffect, useRef } from "react";
import AdminSideNav from "../../components/nav/AdminSideNav";
import Header from "../../components/nav/Header";
import "../../CSS/styles.css";
import NewFishSpecies from "../../components/FormLiblary";
import FishGallery from "../../components/SpeciesGallery";

const AdminPage = ({ onLogout }) => {
    const [selectedItem, setSelectedItem] = useState("home");
    const [isComponentVisible, setIsComponentVisible] = useState(false);
    const fishGalleryRef = useRef(null);

    useEffect(() => {
        document.body.style.backgroundColor = "white";
        document.body.style.backgroundImage = "url('nowe_tło.jpg')";
        document.body.style.height = "auto";
        document.body.style.alignItems = "normal";
        
        return () => {
            document.body.style.backgroundColor = "";
            document.body.style.backgroundImage = "";
            document.body.style.height = "";
        };
    }, []);


    const refreshFishData = () => {
        if (fishGalleryRef.current) {
            fishGalleryRef.current.fetchData();
        }
    };

    const toggleComponentVisibility = () => {
        setIsComponentVisible(prevState => !prevState);
    };

    return (
        <div>
            <AdminSideNav onLogout={onLogout} onSelect={setSelectedItem} />
            <Header />
            {selectedItem === "home" && (
                <>
                    <h1>ADMIN</h1>
                </>
            )}
            {selectedItem === "Species" && (
                <>
                    <h1>Biblioteka gatunków</h1>
                    <FishGallery ref={fishGalleryRef} />
                    <button onClick={toggleComponentVisibility}>
                        {isComponentVisible ? 'Schowaj formularz' : 'Dodaj gatunek'}
                    </button>
                    {isComponentVisible && <NewFishSpecies onSubmit={refreshFishData} />}
                </>
            )}
            {selectedItem === "AquaDevice" && (
                <>
                    <h1>Bibioteka urządzeń</h1>
                </>
            )}
        </div>
    );
};

export default AdminPage;
