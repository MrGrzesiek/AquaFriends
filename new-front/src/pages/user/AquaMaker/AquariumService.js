import axios from 'axios';
import {insertAquarium, deleteAquarium, updateAquariumData} from '../../../components/ApiConnector';
const API_URL = 'http://localhost:8000/aquariums';

export const createNewAquarium = async (aquariumData) => {
    try {
       insertAquarium(aquariumData) 
    } catch (error) {
        if (error.response && error.response.status === 422) {
            throw new Error('Unprocessable Entity: Please check the data you have entered.');
        }
        throw error;
    }
};

export const deleteExistingAquarium = async (aquariumId) => {
    try{
      deleteAquarium(aquariumId)
    }catch(error){
        if (error.response && error.response.status === 422) {
            throw new Error('Unprocessable Entity: Please check the data you have entered.');
        }
        throw error;
    }
}

export const editAquarium = async (aquariumId, aquariumData) => {
    try{
        updateAquariumData(aquariumId, aquariumData)
    }catch(error){
        if (error.response && error.response.status === 422) {
            throw new Error('Unprocessable Entity: Please check the data you have entered.');
        }
        throw error;
    }
}

// Implement other API calls similarly
