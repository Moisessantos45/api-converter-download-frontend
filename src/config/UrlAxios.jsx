import axios from "axios";

const UrlAxios = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/`,
});

export default UrlAxios;
