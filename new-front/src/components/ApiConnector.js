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

    const response = await fetch(`http://localhost:8000/devices/new_device?token=${tokenObj.access_token}`, {
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
      const response = await axios.get('http://localhost:8000/devices/all_devices?token='+tokenObj.access_token);
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

    const response = await fetch(`http://localhost:8000/devices/delete/${deviceID}?token=${tokenObj.access_token}`, {
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