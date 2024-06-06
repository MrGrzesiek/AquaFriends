import React, { useState, useEffect } from "react";
import AdminSideNav from "../../components/nav/AdminSideNav";
import Header from "../../components/nav/Header";
import "../../CSS/styles.css";
import NewFishSpecies from "../../components/FormLiblary"
import { fetchSpeciesData } from "../../components/ApiConnector";
import FishGallery from "../../components/SpeciesGallery"

const AdminPage = ({ onLogout }) => {

  const [selectedItem, setSelectedItem] = useState("home");
  useEffect(() => {
    console.log("ADMIN");
    document.body.style.backgroundColor = "white";
    document.body.style.backgroundImage = "url('nowe_tło.jpg')";
    document.body.style.height = "auto";
    document.body.style.alignItems = "normal";

    // Warto również zresetować kolor tła po odmontowaniu komponentu
    return () => {
      document.body.style.backgroundColor = "";
      document.body.style.backgroundImage = "";
      document.body.style.height = "";
    };
  }, []);
  async function handleClick() {
    try {
      const data = await fetchSpeciesData(); // Wywołaj funkcję fetchData i oczekuj na zwrócenie danych
      // Tutaj możesz wykonać operacje na danych, np. przypisać je do zmiennej lub przekazać je gdzie indziej
      console.log("Zwrócone dane:", data);
    } catch (error) {
      console.error("Wystąpił błąd:", error);
    }
  }
  const [isComponentVisible, setIsComponentVisible] = useState(false);
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
          <button className="submit-button" onClick={handleClick}>Dodaj</button>
        </>
      )}
      {selectedItem === "Species" && (
        <>
          <h1>Biblioteka gatunków</h1>
          <FishGallery />
          <button onClick={toggleComponentVisibility}>
            {isComponentVisible ? 'Schowaj formularz' : 'Dodaj gatunek'}
          </button>
          {isComponentVisible && <NewFishSpecies reloadGalleryData/>}
        </>
      )}
      {selectedItem === "AquaAccount" && (
        <>
          <h1>AquaAccount</h1>
          {/* Add AquaAccount related component or content here */}
        </>
      )}
    </div>
  );
};

export default AdminPage;
