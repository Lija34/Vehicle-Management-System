import axios from 'axios';

const API_URL = 'http://localhost:3000';

const getToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }
  return token;
};

export const fetchVehicles = async () => {
  const token = getToken();
  try {
    const response = await axios.get(`${API_URL}/api/vehicles/all`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true // Ensure cookies are sent
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addVehicle = async (vehicle) => {
  const token = getToken();
  try {
    const response = await axios.post(`${API_URL}/api/vehicles/add`, vehicle, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true // Ensure cookies are sent
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateVehicleStatus = async (id, status) => {
  const token = getToken();
  try {
    const response = await axios.put(`${API_URL}/api/vehicles/update/${id}`, { status }, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true // Ensure cookies are sent
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteVehicle = async (id) => {
  const token = getToken();
  try {
    const response = await axios.delete(`${API_URL}/api/vehicles/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true // Ensure cookies are sent
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
