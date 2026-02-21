import axios from "axios"

const API_KEY = import.meta.env.VITE_API_KEY;
const api = axios.create({
    baseURL: "http://localhost:8080/api/v1",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-API-KEY": "c0221589-ca50-4518-9182-615460a3b241"
    }
})

export default api