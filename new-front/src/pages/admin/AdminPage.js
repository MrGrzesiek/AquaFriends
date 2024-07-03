import React, { useState, useEffect, useRef } from "react";
import AdminSideNav from "../../components/nav/AdminSideNav";
import Header from "../../components/nav/Header";
import "../../CSS/styles.css";
import {NewFishSpecies, NewDeviceForm} from "../../components/FormLiblary";
import FishGallery from "../../components/SpeciesGallery";
import DeviceGallery from "../../components/DeviceGallery";
import {getAllDevice} from "../../components/ApiConnector"

const AdminPage = ({ onLogout }) => {
    const [selectedItem, setSelectedItem] = useState("home");
    const [isComponentVisible, setIsComponentVisible] = useState(false);
    const fishGalleryRef = useRef(null);
    const DeviceGalleryRef = useRef(null);

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

    const refreshDeviceGallery = () => {
        if (DeviceGalleryRef.current) {
            DeviceGalleryRef.current.fetchData();
        }
    };

    const toggleComponentVisibility = () => {
        setIsComponentVisible(prevState => !prevState);
    };

    useEffect(() => {
        setIsComponentVisible(false);
    }, [selectedItem]);

    const handleClick = async () => {
        console.log("siema");
        console.log(await getAllDevice());
    };
    

    return (
        <div>
            <AdminSideNav onLogout={onLogout} onSelect={setSelectedItem} />
            <Header />
            {selectedItem === "home" && (
                <>
                    <h1>ADMIN</h1>
                    <button onClick={handleClick} style={{ padding: '10px 20px', fontSize: '16px' }}>
                         Kliknij mnie
                    </button>
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
                    <DeviceGallery ref={DeviceGalleryRef} />
                    <button onClick={toggleComponentVisibility}>
                        {isComponentVisible ? 'Schowaj formularz' : 'Dodaj urządzenie'}
                    </button>
                    {isComponentVisible && <NewDeviceForm onSubmit={refreshDeviceGallery} />}
                </>
            )}
        </div>
    );
};

export default AdminPage;
