import axios from 'axios';

export const submitSpeciesData = async (data,method) => {
  try {
    const tokenString = localStorage.getItem("authToken");
    const tokenObj = JSON.parse(tokenString);

    const requestBody = {
      name: data.name,
      description: data.description,
      min_temp: parseFloat(data.min_temp),
      max_temp: parseFloat(data.max_temp),
      min_ph: parseFloat(data.min_ph),
      max_ph: parseFloat(data.max_ph),
      min_salinity: parseFloat(data.min_salinity),
      max_salinity: parseFloat(data.max_salinity),
    };

    const response = await fetch("http://localhost:8000/fishes/species?token="+tokenObj.access_token, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenObj.access_token}`
      },
      body: JSON.stringify(requestBody),
    });

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
      formData.append("photo", image);
      const tokenString = localStorage.getItem("authToken");
      const tokenObj = JSON.parse(tokenString);
  
      const response = await fetch(`http://localhost:8000/fishes/species_photo/${speciesName}?token=`+tokenObj.access_token, {
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
  export const fetchSpeciesData = async () => {
    try {
        const tokenString = localStorage.getItem("authToken");
        const tokenObj = JSON.parse(tokenString);
        const response = await axios.get('http://localhost:8000/fishes/species?token='+tokenObj.access_token);
        if (response.data.code!=200) {
          throw new Error('Failed to fetch species data');
        }
        else{
          return response.data.species;
        }
    } catch (error) {
        console.log(error)
    }
  };
  export const fetchSpeciesPhoto = async (speciesName) => {
    try {
        const tokenString = localStorage.getItem("authToken");
        const tokenObj = JSON.parse(tokenString);
        const response = await fetch(`http://localhost:8000/fishes/species_photo/${speciesName}?token=${tokenObj.access_token}`);
        if (!response.ok) {
            throw new Error("Failed to fetch species photo");
        }
        const blob = await response.blob();
        return URL.createObjectURL(blob); // Tworzymy URL do lokalnego pliku
    } catch (error) {
        console.error("Error fetching species photo:", error);
        throw error;
    }
};

  export const fetchUserAquariums = async (user) => {
    try {
      const tokenString = localStorage.getItem("authToken");
      const tokenObj = JSON.parse(tokenString);
      const response = await axios.get(`http://localhost:8000/aquariums/user_aquariums?token=`+tokenObj.access_token);
      if (response.data.code!==200) {
        throw new Error('Failed to fetch user aquariums');
      }
      else{
        console.log(response.data.Aquariums)
        return response.data.Aquariums;
      }
    } catch (error) {
      console.log(error)
    }
  }
  
export const deleteSpecies = async (speciesName) => {
  try {
    console.log(speciesName)
    const tokenString = localStorage.getItem("authToken");
    const tokenObj = JSON.parse(tokenString);

    const response = await fetch(`http://localhost:8000/fishes/species?species_name=${speciesName}&token=${tokenObj.access_token}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      throw new Error(`Failed to delete species: ${response.statusText}`);
    }

    return { message: "Species deleted successfully", status: response.status };

  } catch (error) {
    console.error("Error deleting species:", error);
    throw error;
  }
};
