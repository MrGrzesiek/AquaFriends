import React, { useState, useEffect } from 'react';
import { createNewAquarium } from './AquariumService';
import {updateAquariumData} from "../../../components/ApiConnector";
import { useNavigate, useParams } from 'react-router-dom';

const AquariumForum = ({ initialData = {}, mode = 'create' }) => {
    const [formData, setFormData] = useState({
        username: localStorage.getItem("username"),
        name: '',
        height: 0,
        width: 0,
        length: 0,
        substrate: '',
        plants: {},
        decorations: {},
        temperature: 7,
        ph: 7,
        No2: 2,
        No3: 2,
        GH: 2,
        KH: 2,
        pump: {},
        heater: {},
        luminance: {},
        accessories: {},
        fishes: []
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (mode === 'edit' && initialData) {
            setFormData(initialData);
        }
    }, [initialData, mode]);

    const handleChangeText = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleChangeNumber = (e) => {
        const { name, value } = e.target;
        const parsedValue = parseFloat(value);
        setFormData({
            ...formData,
            [name]: parsedValue < 0 ? 0 : parsedValue
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        // Validation checks
        if (!formData.name || formData.name.trim() === '') {
            newErrors.name = 'Nazwa akwarium jest wymagana.';
        }

        if (!formData.username || formData.username.trim() === 'undefined') {
            newErrors.username = 'Nazwa użytkownika jest wymagana.';
        }

        if (formData.temperature <= 0 || formData.temperature >= 100) {
            newErrors.temperature = 'Temperatura musi być pomiędzy 0 a 100 stopni Celsiusza.';
        }

        if (formData.width <= 5) {
            newErrors.width = 'Szerokość musi być większa niż 5.';
        }

        if (formData.height <= 5) {
            newErrors.height = 'Wysokość musi być większa niż 5.';
        }

        if (formData.length <= 5) {
            newErrors.length = 'Długość musi być większa niż 5.';
        }

        // Check for any errors before submitting
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        } else {
            setErrors({});
        }

        try {
            const username = localStorage.getItem("username");
            formData.username = username;

            if (mode === 'create') {
                await createNewAquarium(formData);
                navigate('/'); // Redirect to success page or handle success scenario
            } else if (mode === 'edit') {
                await updateAquariumData(id, formData);
                navigate(`/aquarium/${id}`); // Redirect to the updated aquarium's details page
            }
        } catch (error) {
            console.error('Error creating or updating aquarium:', error);
            alert(`Wystąpił błąd podczas ${mode === 'create' ? 'tworzenia' : 'aktualizacji'} akwarium.`);
        }
    };

    return (
        <form className="data-form" onSubmit={handleSubmit}>
            <h2>{mode === 'create' ? 'Formularz nowego akwarium' : 'Edytuj akwarium'}</h2>

            <div className="form-group">
                <label>
                    Nazwa:
                    <input type="text" name="name" value={formData.name} onChange={handleChangeText} required />
                </label>
                {errors.name && <p className="error-message">{errors.name}</p>}
            </div>

            <div className="form-group">
                <label>
                    Wysokość:
                    <input type="number" name="height" value={formData.height} onChange={handleChangeNumber} required />
                </label>
                {errors.height && <p className="error-message">{errors.height}</p>}
            </div>

            <div className="form-group">
                <label>
                    Szerokość:
                    <input type="number" name="width" value={formData.width} onChange={handleChangeNumber} required />
                </label>
                {errors.width && <p className="error-message">{errors.width}</p>}
            </div>

            <div className="form-group">
                <label>
                    Długość:
                    <input type="number" name="length" value={formData.length} onChange={handleChangeNumber} required />
                </label>
                {errors.length && <p className="error-message">{errors.length}</p>}
            </div>

            <div className="form-group">
                <label>
                    Podłoże:
                    <input type="text" name="substrate" value={formData.substrate} onChange={handleChangeText} required />
                </label>
                {errors.substrate && <p className="error-message">{errors.substrate}</p>}
            </div>

            <button className="submit-button" type="submit">{mode === 'create' ? 'Dodaj' : 'Zapisz zmiany'}</button>
        </form>
    );
};

export default AquariumForum;
