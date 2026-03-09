import axios from "axios"

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, 
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
})

export default API