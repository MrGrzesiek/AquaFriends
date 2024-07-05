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
        const response = await axios.get(`${API_URL}/fishes/species?token=`+tokenObj.access_token);
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


export const  insertAquarium = async(data) => {
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

  const response = await fetch(`${API_URL}/aquariums/new_aquarium?token=${tokenObj.access_token}`, {
  method: "POST",
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

const createRequestBody = (data) => {
  // Wspólne pola dla wszystkich urządzeń
  let requestBody = {
    name: data.name,
    description: data.description,
    power: data.power,
    minV: data.minV,
    maxV: data.maxV,
    efficiency: data.efficiency,
    type: data.type
  };

  // Dodanie specyficznych pól na podstawie typu urządzenia
  switch(data.type) {
    case 'Pump':
      requestBody = {
        ...requestBody,
        flow: data.flow
      };
      break;
      
    case 'Light':
      requestBody = {
        ...requestBody,
        luminance: data.luminance,
        brightness: data.brightness,
        color: data.color
      };
      break;
      
    case 'Filter':
      requestBody = {
        ...requestBody,
        filter_type: data.filter_type,
        flow_max: data.flow_max
      };
      break;
      
    case 'Heater':
      requestBody = {
        ...requestBody,
        min_temp: data.min_temperature,
        max_temp: data.max_temperature
      };
      break;

    default:
      throw new Error(`Unknown device type: ${data.type}`);
  }

  return requestBody;
};

export const submitDeviceData  = async (data) =>{
  try {
    const tokenString = localStorage.getItem("authToken");
    const tokenObj = JSON.parse(tokenString);
    console.log(tokenObj.access_token)
    const requestBody = createRequestBody(data);
    console.log(requestBody);

    const response = await fetch(`${API_URL}/devices/new_device?token=${tokenObj.access_token}`, {
      method: "POST",
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

export const getAllDevice  = async () =>{
  try {
      const tokenString = localStorage.getItem("authToken");
      const tokenObj = JSON.parse(tokenString);
      const response = await axios.get(`${API_URL}/devices/all_devices?token=`+tokenObj.access_token);
      if (response.data.code!=200) {
        throw new Error('Failed to fetch species data');
      }
      else{
        return response.data.Devices;
      }
  } catch (error) {
      console.log(error)
  }
};
export const deleteDevice = async (deviceID) => {
  try {
    console.log(deviceID)
    const tokenString = localStorage.getItem("authToken");
    const tokenObj = JSON.parse(tokenString);

    const response = await fetch(`${API_URL}/devices/delete/${deviceID}?token=${tokenObj.access_token}`, {
      method: "DELETE"
    });
    console.log(response)
    if (!response.ok) {
      throw new Error(`Failed to delete device: ${response.statusText}`);
    }

    return { message: "Device deleted successfully", status: response.status };

  } catch (error) {
    console.error("Error deleting device:", error);
    throw error;
  }
};

export const getAquariumWarnings = async (aquariumName) => {
    try {
        const tokenString = localStorage.getItem("authToken");
        const tokenObj = JSON.parse(tokenString);
        //                                                                       http://localhost:8000/warnings/for_aquarium/Loch%20Ness?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJNYXRpIiwiZXhwIjoxNzIwMTM0NzczfQ.IMMUN5rbO4Pi38hmjHs01B5Pw65lfoVuj5umqmibIdQ
        const response = await fetch(`${API_URL}/warnings/for_aquarium/${aquariumName}?token=${tokenObj.access_token}`);
        if (!response.ok) {
        throw new Error("Failed to fetch aquarium warnings, response status: ", response.status);
        }
        return response.json();
    } catch (error) {
        console.error("Error fetching aquarium warnings:", error);
        throw error;
    }
}

export const getAquariumEvents = async (aquariumName) => {
    try {
        const tokenString = localStorage.getItem("authToken");
        const tokenObj = JSON.parse(tokenString);
        const response = await fetch(`${API_URL}/aquariums/events/${aquariumName}?token=${tokenObj.access_token}`);
        return response.json();
    } catch (error) {
        console.error("Error fetching aquarium events:", error);
        throw error;
    }
}

export const dismiss_event = async (eventID) => {
    try {
        console.log("Dismissing event with ID:", eventID)
        const tokenString = localStorage.getItem("authToken");
        const tokenObj = JSON.parse(tokenString);
        const response = await fetch(`${API_URL}/aquariums/dismiss_event/${eventID}?token=${tokenObj.access_token}`, {
            method: "DELETE",
        });
        return response.json();
    } catch (error) {
        console.error("Error dismissing event:", error);
        throw error;
    }
}
export const getAllWarning  = async () =>{
  try {
      const tokenString = localStorage.getItem("authToken");
      const tokenObj = JSON.parse(tokenString);
      const response = await axios.get(`${API_URL}/warnings?token=`+tokenObj.access_token);
      if (response.status!=200) {
        throw new Error('Failed to fetch warnings data');
      }
      else{
        return response.data.warnings;
      }
  } catch (error) {
      console.log(error)
  }
};
export const deleteWarning = async (WarningID) => {
  try {
    console.log(WarningID)
    const tokenString = localStorage.getItem("authToken");
    const tokenObj = JSON.parse(tokenString);

    const response = await fetch(`${API_URL}/warnings/${WarningID}?token=${tokenObj.access_token}`, {
      method: "DELETE"
    });
    console.log(response)
    if (!response.ok) {
      throw new Error(`Failed to delete warning: ${response.statusText}`);
    }

    return { message: "Warning deleted successfully", status: response.status };

  } catch (error) {
    console.error("Error deleting warning:", error);
    throw error;
  }
};

export const updateFishesInAquarium = async (aquariumName, fishData) => {
    const token = localStorage.getItem("authToken");
    const tokenObj = JSON.parse(token);
    const response = await fetch(`/api/aquarium/${aquariumName}/fishes`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${tokenObj.access_token}`
        },
        body: JSON.stringify(fishData)
    });

    if (!response.ok) {
        throw new Error("Failed to update fishes in aquarium");
    }

    return response.json();
};

