import React, { useState } from "react";
import "../CSS/DataForm.css";
import { submitSpeciesData, uploadSpeciesImage, submitDeviceData  } from "./ApiConnector";

export const NewFishSpecies = ({ onSubmit }) => {
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

export const NewDeviceForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    power: 0,
    minV: 0,
    maxV: 0,
    efficiency: 0,
    description: "",
    type: "Pump",
    flow: 0,
    luminance: 0,
    brightness: 0,
    flow_max: 0,
    min_temperature: 0,
    max_temperature: 0
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Walidacja ogólna
    if (!formData.name || !formData.description || !formData.type) {
      newErrors.general = "Proszę wypełnić wszystkie wymagane pola.";
    }
    if (formData.minV < 10) {
      newErrors.minV = "Minimalna objętość akwarium nie może być mniejsza niż 10 litrów.";
    }
    if (formData.minV > formData.maxV) { // Załóżmy, że maxV to jakieś inne specyficzne wymaganie
      newErrors.minV = "Minimalna objętość nie może być większa niż maksymalne napięcie.";
      newErrors.maxV = "Maksymalna objętość nie może być mniejsze niż minimalna objętość akwarium.";
    }
    if (formData.efficiency < 10 || formData.efficiency > 100) {
      newErrors.efficiency = "Sprawność musi być wartością od 10 do 100.";
    }

    // Walidacja specyficzna dla typu urządzenia
    switch (formData.type) {
      case "Pump":
        if (formData.flow <= 0) {
          newErrors.flow = "Przepływ nie może być mniejszy niż 0.1 L/min.";
        }
        break;
      case "Light":
        if (formData.luminance <= 0) {
          newErrors.luminance = "Luminancja nie może być mniejsza niż 0.1.";
        }
        if (formData.brightness <= 0) {
          newErrors.brightness = "Jasność nie może być mniejsza niż 1.";
        }
        break;
      case "Filter":
        if (formData.flow_max <= 0.1) {
          newErrors.flow_max = "Przepływ maksymalny nie może być mniejszy niż 0.1 L/min.";
        }
        break;
      case "Heater":
        if (formData.min_temperature <= 1) {
          newErrors.min_temperature = "Minimalna temperatura nie może być mniejsza niż 1°C.";
        }
        if (formData.max_temperature >= 100) {
          newErrors.max_temperature = "Maksymalna temperatura nie może być większa niż 100°C.";
        }
        if (formData.min_temperature > formData.max_temperature) {
          newErrors.min_temperature = "Minimalna temperatura nie może być większa niż maksymalna temperatura.";
          newErrors.max_temperature = "Maksymalna temperatura nie może być mniejsza niż minimalna temperatura.";
        }
        break;
      default:
        newErrors.type = "Nieznany typ urządzenia.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const res = await submitDeviceData(formData, "POST");
        if (res.code === 200) {
          alert("Pomyślnie dodano urządzenie");
          onSubmit(); // Call the refresh method after adding the new device
        } else if (res.code === 400) {
          alert("Takie urządzenie już istnieje.");
        }
      } catch (error) {
        console.error("Error adding device:", error);
        alert("Wystąpił błąd podczas dodawania urządzenia.");
      }
    }
  };

  return (
    <form className="data-form" onSubmit={handleSubmit}>
      <h2>Formularz nowego urządzenia</h2>
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
      <div className="form-group">
        <label htmlFor="type">Typ urządzenia:</label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        >
          <option value="Pump">Pompa</option>
          <option value="Light">Światło</option>
          <option value="Filter">Filtr</option>
          <option value="Heater">Grzałka</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="power">Moc (W):</label>
        <input
          type="number"
          step="0.1"
          id="power"
          name="power"
          value={formData.power}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="minV">Minimalna objętość akwarium (L):</label>
          <input
            type="number"
            step="0.1"
            id="minV"
            name="minV"
            value={formData.minV}
            onChange={handleChange}
            required
            style={{ borderColor: errors.minV ? "red" : "" }}
          />
          {errors.minV && <p className="error-message">{errors.minV}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="maxV">Maksymalna objętość akwarium (L):</label>
          <input
            type="number"
            step="0.1"
            id="maxV"
            name="maxV"
            value={formData.maxV}
            onChange={handleChange}
            required
            style={{ borderColor: errors.maxV ? "red" : "" }}
          />
          {errors.maxV && <p className="error-message">{errors.maxV}</p>}
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="efficiency">Sprawność (%):</label>
        <input
          type="number"
          step="0.1"
          id="efficiency"
          name="efficiency"
          value={formData.efficiency}
          onChange={handleChange}
          required
          style={{ borderColor: errors.efficiency ? "red" : "" }}
        />
        {errors.efficiency && <p className="error-message">{errors.efficiency}</p>}
      </div>
      
      {/* Pola specyficzne dla typu urządzenia */}
      {formData.type === "Pump" && (
        <div className="form-group">
          <label htmlFor="flow">Przepływ (L/min):</label>
          <input
            type="number"
            step="0.1"
            id="flow"
            name="flow"
            value={formData.flow}
            onChange={handleChange}
            required
            style={{ borderColor: errors.flow ? "red" : "" }}
          />
          {errors.flow && <p className="error-message">{errors.flow}</p>}
        </div>
      )}

{formData.type === "Light" && (
  <>
    <div className="form-group">
      <label htmlFor="luminance">Luminancja:</label>
      <input
        type="number"
        step="0.1"
        id="luminance"
        name="luminance"
        value={formData.luminance}
        onChange={handleChange}
        required
        style={{ borderColor: errors.luminance ? "red" : "" }}
      />
      {errors.luminance && <p className="error-message">{errors.luminance}</p>}
    </div>
    <div className="form-group">
      <label htmlFor="brightness">Jasność:</label>
      <input
        type="number"
        step="0.1"
        id="brightness"
        name="brightness"
        value={formData.brightness}
        onChange={handleChange}
        required
        style={{ borderColor: errors.brightness ? "red" : "" }}
      />
      {errors.brightness && <p className="error-message">{errors.brightness}</p>}
    </div>
    <div className="form-group">
      <label htmlFor="color">Kolor:</label>
      <input
        type="color"
        id="color"
        name="color"
        value={formData.color || "#000000"} // Default color value if not set
        onChange={handleChange}
        required
        style={{ borderColor: errors.color ? "red" : "" }}
      />
      {errors.color && <p className="error-message">{errors.color}</p>}
    </div>
  </>
)}


      {formData.type === "Filter" && (
        <>
        <div className="form-group">
        <label htmlFor="filter_type">Typ filtra:</label>
        <textarea
          id="filter_type"
          name="filter_type"
          value={formData.filter_type}
          onChange={handleChange}
          required
        />
        </div>
        <div className="form-group">
          <label htmlFor="flow_max">Przepływ maksymalny (L/min):</label>
          <input
            type="number"
            step="0.1"
            id="flow_max"
            name="flow_max"
            value={formData.flow_max}
            onChange={handleChange}
            required
            style={{ borderColor: errors.flow_max ? "red" : "" }}
          />
          {errors.flow_max && <p className="error-message">{errors.flow_max}</p>}
        </div>
        </>
      )}

      {formData.type === "Heater" && (
        <>
          <div className="form-group">
            <label htmlFor="min_temperature">Min temperatura (°C):</label>
            <input
              type="number"
              step="0.1"
              id="min_temperature"
              name="min_temperature"
              value={formData.min_temperature}
              onChange={handleChange}
              required
              style={{ borderColor: errors.min_temperature ? "red" : "" }}
            />
            {errors.min_temperature && <p className="error-message">{errors.min_temperature}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="max_temperature">Max temperatura (°C):</label>
            <input
              type="number"
              step="0.1"
              id="max_temperature"
              name="max_temperature"
              value={formData.max_temperature}
              onChange={handleChange}
              required
              style={{ borderColor: errors.max_temperature ? "red" : "" }}
            />
            {errors.max_temperature && <p className="error-message">{errors.max_temperature}</p>}
          </div>
        </>
      )}

      {errors.general && <p className="error-message">{errors.general}</p>}
      
      <button className="submit-button" type="submit">Dodaj</button>
    </form>
  );
};
