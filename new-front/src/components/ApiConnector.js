import axios from 'axios';

export const submitSpeciesData = async (data) => {
    try {
        console.log(data)
      const response = await fetch("http://localhost:8000/fishes/species", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          min_temp: parseFloat(data.min_temp),
          max_temp: parseFloat(data.max_temp),
          min_ph: parseFloat(data.min_ph),
          max_ph: parseFloat(data.max_ph),
          min_salinity: parseFloat(data.min_salinity),
          max_salinity: parseFloat(data.max_salinity),
        }),
      });
      console.log(response)
      if (!response.ok) {
        throw new Error("Failed to submit form data");
      }
  
      return response.json();
    } catch (error) {
      console.error("Error submitting form data:", error);
      throw error;
    }
  };
  
  export const uploadSpeciesImage = async (speciesName, image) => {
    try {
      const formData = new FormData();
      formData.append("image", image);
  
      const response = await fetch(`http://localhost:8000/fishes/species_photo/${speciesName}`, {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Failed to upload image");
      }
  
      return response.json();
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };
  export const fetchData = async () => {
    try {
    console.log("dupa")
        const response = await axios.get('http://localhost:8000/fishes/species');
      console.log(response)
      if (!response.ok) {
        throw new Error('Failed to fetch species data');
      }
      const data = await response.json();
    } catch (error) {
        console.log(error)
    }
  };