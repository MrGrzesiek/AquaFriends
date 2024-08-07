import React, { useState, useEffect, useRef } from "react";
import AdminSideNav from "../../components/nav/AdminSideNav";
import Header from "../../components/nav/Header";
import "../../CSS/styles.css";
import {NewFishSpecies, NewDeviceForm, NewWarning} from "../../components/FormLiblary";
import FishGallery from "../../components/SpeciesGallery";
import DeviceGallery from "../../components/DeviceGallery";
import WarningGallery from "../../components/WarningGallery";

const AdminPage = ({ onLogout }) => {
    const [selectedItem, setSelectedItem] = useState("home");
    const [isComponentVisible, setIsComponentVisible] = useState(false);
    const fishGalleryRef = useRef(null);
    const DeviceGalleryRef = useRef(null);
    const WarningGalleryRef = useRef(null);
    const [username, setUsername] = useState(null);

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
    const refreshWarningGallery = () => {
        if (WarningGalleryRef.current) {
            WarningGalleryRef.current.fetchData();
        }
    };

    const toggleComponentVisibility = () => {
        setIsComponentVisible(prevState => !prevState);
    };

    useEffect(() => {
        setIsComponentVisible(false);
    }, [selectedItem]);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        setUsername(storedUsername || 'Gość');
      }, []);
    

    return (
        <div>
            <AdminSideNav onLogout={onLogout} onSelect={setSelectedItem} />
            <Header />
            {selectedItem === "home" && (
                <>
                    <h1>Witaj, {username}!</h1>
                </>
            )}
            {selectedItem === "Species" && (
                <>
                    <h1>Biblioteka gatunków</h1>
                    <FishGallery ref={fishGalleryRef} onSubmit={refreshFishData} />
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
            {selectedItem === "Warning" && (
                <>
                    <h1>Bibioteka ostrzeżeń</h1>
                    <WarningGallery ref={WarningGalleryRef}/>
                    <button onClick={toggleComponentVisibility}>
                        {isComponentVisible ? 'Schowaj formularz' : 'Dodaj ostrzeżenie'}
                    </button>
                    {isComponentVisible && <NewWarning onSubmit={refreshWarningGallery} />}
                </>
            )}
        </div>
    );
};

export default AdminPage;
