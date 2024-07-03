import axios from 'axios';

const API_URL = 'http://localhost:8000';

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

    const response = await fetch(`${API_URL}/fishes/species?token=`+tokenObj.access_token, {
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
  
      const response = await fetch(`${API_URL}/fishes/species_photo/${speciesName}?token=`+tokenObj.access_token, {
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
        const response = await axios.get('${API_URL}/fishes/species?token='+tokenObj.access_token);
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
        const response = await fetch(`${API_URL}/fishes/species_photo/${speciesName}?token=${tokenObj.access_token}`);
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
      const response = await axios.get(`${API_URL}/aquariums/user_aquariums?token=`+tokenObj.access_token);
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

    const response = await fetch(`${API_URL}/fishes/species?species_name=${speciesName}&token=${tokenObj.access_token}`, {
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

export const fetchAquariumData = async (aquariumName) => {
  try {
    const tokenString = localStorage.getItem("authToken");
    if (!tokenString) {
      throw new Error('No auth token found');
    }

    const tokenObj = JSON.parse(tokenString);
    if (!tokenObj || !tokenObj.access_token) {
      throw new Error('Invalid auth token');
    }

    const response = await fetch(`${API_URL}/aquariums/history/${aquariumName}?token=${tokenObj.access_token}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching aquarium data:', error, error.message);
    return null; // or [] depending on how you handle it in your component
  }
};

export const uploadNewEvent = async (aquariumName, eventType, eventDescription) => {
        const tokenString = localStorage.getItem("authToken");
        const tokenObj = JSON.parse(tokenString);

        const requestBody = {
          aquarium_name: aquariumName,
          event_type: eventType,
          event_time: new Date().toISOString(),
          event_description: eventDescription,
        };

        const response = await fetch(`${API_URL}/aquariums/event?token=${tokenObj.access_token}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        });
        return response.json();
}

export const  updateAquariumData = async(data) => {
        console.log(data)
        const tokenString = localStorage.getItem("authToken");
        const tokenObj = JSON.parse(tokenString);

        const formBody = {
            username: data.username,
            name: data.name,
            height: parseFloat(data.height),
            width: parseFloat(data.width),
            length: parseFloat(data.length),
            substrate: data.substrate,
            plants: data.plants,
            decorations: data.decorations,
            temperature: parseFloat(data.temperature),
            ph: parseFloat(data.ph),
            No2: parseFloat(data.No2),
            No3: parseFloat(data.No3),
            GH: parseFloat(data.GH),
            KH: parseFloat(data.KH),
            pump: data.pump,
            heater: data.heater,
            luminance: data.luminance,
            accessories: data.accessories,
            fishes: data.fishes
        }
    console.log(formBody)

        const response = await fetch(`${API_URL}/aquariums/update?token=${tokenObj.access_token}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        });

        return response.json();
}

export const fetchUser = async () => {
    try {
        const tokenString = localStorage.getItem("authToken");
        const tokenObj = JSON.parse(tokenString);
        const response = await fetch(`${API_URL}/auth/me?token=${tokenObj.access_token}`);
        if (!response.ok) {
        throw new Error("Failed to fetch user data");
        }
        return response.json();
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
}

export const updateEmail = async (email) => {
    try {
        const tokenString = localStorage.getItem("authToken");
        const tokenObj = JSON.parse(tokenString);
        const response = await fetch(`${API_URL}/auth/update_email?email=${email}&token=${tokenObj.access_token}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
        });
        // Log response for debugging
        console.log(response);
        console.log('Response status:', response.status);
        const responseBody = await response.json(); // Get the raw response text
        console.log('Response body:', responseBody);

        // Convert response text to JSON
        return responseBody;
    } catch (error) {
        console.error("Error updating email:", error);
        throw error;
    }
}
