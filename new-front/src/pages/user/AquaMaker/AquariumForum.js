import React, { useState } from 'react';
import { createNewAquarium } from './AquariumService';
import { useNavigate } from 'react-router-dom';

const AquariumForm = () => {
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

    const handleChangeText = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleChangeNumber = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: parseFloat(value)
        });
    };

    const handleSubmit = async (e) => {
        console.log("Form data: ", formData);
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
            console.log("dupa");
            setErrors(newErrors);
            return;
        } else {
            console.log("dupa");
            setErrors({});
        }

        try {
            console.log("dupa");
            const username = localStorage.getItem("username");
            formData.username = username;
            await createNewAquarium(formData);
            //navigate('/success'); // Redirect to success page or handle success scenario
        } catch (error) {
            console.error('Error creating aquarium:', error);
            alert('Wystąpił błąd podczas tworzenia akwarium.');
        }
    };

    return (
        <form className="data-form" onSubmit={handleSubmit}>
            <h2>Formularz nowego akwarium</h2>

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

            <button className="submit-button" type="submit">Dodaj</button>
        </form>
    );
};

export default AquariumForm;
