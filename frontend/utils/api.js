// frontend/utils/api.ts
import axios from "axios";
import { BASE_URL } from "../config"; // adjust path if needed

const API = axios.create({
  baseURL: BASE_URL,
});

export default API;
