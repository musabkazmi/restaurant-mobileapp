// frontend/utils/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://192.168.2.59:5000'
  // baseURL: 'http://localhost:5000', // Use IP address on physical devices
    

});

export default API;
