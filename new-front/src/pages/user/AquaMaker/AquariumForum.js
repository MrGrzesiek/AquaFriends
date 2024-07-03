import React, { useState } from 'react';
import { createNewAquarium } from './AquariumService';
import { useNavigate } from 'react-router-dom';

const AquariumForm = () => {
    const [formData, setFormData] = useState({
        username: '',
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
        e.preventDefault();
        
        const username = localStorage.getItem("username");
        formData.username = username;
        await createNewAquarium(formData);
        navigate('/aquariums');
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Name:
                <input type="text" name="name" value={formData.name} onChange={handleChangeText} required />
            </label>
            <label>
                Height:
                <input type="number" name="height" value={formData.height} onChange={handleChangeNumber} required />
            </label>
            <label>
                Width:
                <input type="number" name="width" value={formData.width} onChange={handleChangeNumber} required />
            </label>
            <label>
                Length:
                <input type="number" name="length" value={formData.length} onChange={handleChangeNumber} required />
            </label>
            <label>
                Substrate:
                <input type="text" name="substrate" value={formData.substrate} onChange={handleChangeText} required />
            </label>
            {/* Add other fields similarly */}
            <button type="submit">Create Aquarium</button>
        </form>
    );
};

export default AquariumForm;
