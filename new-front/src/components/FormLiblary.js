import React, { useState } from "react";
import "../CSS/DataForm.css";
import { submitSpeciesData, uploadSpeciesImage } from "./ApiConnector";

const NewFishSpecies = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    min_temp: "",
    max_temp: "",
    min_ph: "",
    max_ph: "",
    min_salinity: "",
    max_salinity: "",
    image: null
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        image: file
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (parseFloat(formData.min_temp) > parseFloat(formData.max_temp)) {
      newErrors.min_temp = "Temperatura minimalna nie może być wyższa niż temperatura maksymalna.";
      newErrors.max_temp = "Temperatura maksymalna nie może być niższa niż temperatura minimalna.";
    }
    if (parseFloat(formData.min_ph) > parseFloat(formData.max_ph)) {
      newErrors.min_ph = "Minimalne pH nie może być większe niż maksymalne pH.";
      newErrors.max_ph = "Maksymalne pH nie może być mniejsze niż minimalne pH.";
    }
    if (parseFloat(formData.min_salinity) > parseFloat(formData.max_salinity)) {
      newErrors.min_salinity = "Zasolenie minimalne nie może być większe niż zasolenie maksymalne.";
      newErrors.max_salinity = "Zasolenie maksymalne nie może być mniejsze niż zasolenie minimalne.";
    }
    if (parseFloat(formData.min_ph) < 0 || parseFloat(formData.max_ph) < 0) {
      newErrors.min_ph = "Minimalne pH nie może być ujemne.";
      newErrors.max_ph = "Maksymalne pH nie może być ujemne.";
    }
    if (parseFloat(formData.min_salinity) < 0 || parseFloat(formData.max_salinity) < 0) {
      newErrors.min_salinity = "Zasolenie minimalne nie może być ujemne.";
      newErrors.max_salinity = "Zasolenie maksymalne nie może być ujemne.";
    }
    if (parseFloat(formData.min_temp) < 0 || parseFloat(formData.max_temp) < 0) {
      newErrors.min_temp = "Temperatura minimalna nie może być ujemna.";
      newErrors.max_temp = "Temperatura maksymalna nie może być ujemna";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const res = await submitSpeciesData(formData,"POST");
        if (res.code === 200) {
          let successMessage = "Pomyślnie dodano gatunek";
          if (formData.image) {
            const res2 = await uploadSpeciesImage(formData.name, formData.image);
            if (res2.code === 200) {
              successMessage += " z obrazkiem";
            }
          }
          alert(successMessage);
          onSubmit(); // Call the refresh method after adding the new species
        } else if (res.code === 400) {
          alert("Taki gatunek już istnieje.");
        }
      } catch (error) {
        console.error("Error adding species:", error);
        alert("Wystąpił błąd podczas dodawania gatunku.");
      }
    }
  };

  return (
    <form className="data-form" onSubmit={handleSubmit}>
      <h2>Formularz nowego gatunku</h2>
      <div className="form-group">
        <label htmlFor="name">Nazwa:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Opis:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="min_temp">Min Temp:</label>
          <input
            type="number"
            step="0.1"
            id="min_temp"
            name="min_temp"
            value={formData.min_temp}
            onChange={handleChange}
            required
            style={{ borderColor: errors.min_temp ? "red" : "" }}
          />
          {errors.min_temp && <p className="error-message">{errors.min_temp}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="max_temp">Max Temp:</label>
          <input
            type="number"
            step="0.1"
            id="max_temp"
            name="max_temp"
            value={formData.max_temp}
            onChange={handleChange}
            required
            style={{ borderColor: errors.max_temp ? "red" : "" }}
          />
          {errors.max_temp && <p className="error-message">{errors.max_temp}</p>}
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="min_ph">Min PH:</label>
          <input
            type="number"
            step="0.1"
            id="min_ph"
            name="min_ph"
            value={formData.min_ph}
            onChange={handleChange}
            required
            style={{ borderColor: errors.min_ph ? "red" : "" }}
          />
          {errors.min_ph && <p className="error-message">{errors.min_ph}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="max_ph">Max PH:</label>
          <input
            type="number"
            step="0.1"
            id="max_ph"
            name="max_ph"
            value={formData.max_ph}
            onChange={handleChange}
            required
            style={{ borderColor: errors.max_ph ? "red" : "" }}
          />
          {errors.max_ph && <p className="error-message">{errors.max_ph}</p>}
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="min_salinity">Min Zasolenie:</label>
          <input
            type="number"
            step="1"
            id="min_salinity"
            name="min_salinity"
            value={formData.min_salinity}
            onChange={handleChange}
            required
            style={{ borderColor: errors.min_salinity ? "red" : "" }}
          />
          {errors.min_salinity && <p className="error-message">{errors.min_salinity}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="max_salinity">Max Zasolenie:</label>
          <input
            type="number"
            step="1"
            id="max_salinity"
            name="max_salinity"
            value={formData.max_salinity}
            onChange={handleChange}
            required
            style={{ borderColor: errors.max_salinity ? "red" : "" }}
          />
          {errors.max_salinity && <p className="error-message">{errors.max_salinity}</p>}
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="image">Wybierz zdjęcie (opcja):</label>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
        />
        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Image Preview" />
          </div>
        )}
      </div>
      <button className="submit-button" type="submit">Dodaj</button>
    </form>
  );
};

export default NewFishSpecies;
