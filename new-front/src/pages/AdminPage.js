import React, { useState, useEffect } from "react";
import AdminSideNav from "../components/AdminSideNav";
import Header from "../components/Header";
import "../CSS/styles.css";
import NewFishSpecies from "../components/FormLiblary"
import { fetchData } from "../components/ApiConnector";

const AdminPage = ({ onLogout }) => {
  const fishData = {
    name: "",
    description: "",
    min_temp: 0,
    max_temp: 0,
    min_ph: 0,
    max_ph: 0,
    min_salinity: 0,
    max_salinity: 0
  };

  const [selectedItem, setSelectedItem] = useState("home");
  useEffect(() => {
    console.log("ADMIN");

    // Zmiana koloru tła dla całej strony po załadowaniu komponentu HomePage
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

  return (
    <div>
      <AdminSideNav onLogout={onLogout} onSelect={setSelectedItem} />
      <Header />
      {selectedItem === "home" && (
        <>
          <h1>ADMIN</h1>
          <button className="submit-button" onClick={fetchData}>Dodaj</button>
        </>
      )}
      {selectedItem === "Species" && (
        <>
          <h1>Kreator gatunków</h1>
          {<NewFishSpecies/>}
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
