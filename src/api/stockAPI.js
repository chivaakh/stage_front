// src/api/stock.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';  // ajoute /api ici

export const getSpecifications = () => {
  return axios.get(`${API_URL}/specifications/`);
};
