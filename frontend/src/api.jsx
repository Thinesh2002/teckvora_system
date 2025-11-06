import axios from "axios";

const API = axios.create({
  baseURL: "https://system-api.teckvora.com/api",
});


API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;