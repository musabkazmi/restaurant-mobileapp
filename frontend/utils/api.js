// frontend/utils/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000', // Use IP address on physical devices
});

export default API;
