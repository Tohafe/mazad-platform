import axios from "axios"

const API_KEY = import.meta.env.VITE_API_KEY;

//for frontend Dev, remove it before push @Naoufal
//const BASE_URL = '/api/v1'
const BASE_URL = 'https://localhost:443/api/v1'

const HEADERS = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "X-API-KEY": API_KEY
};

const api = axios.create({
    baseURL: BASE_URL,
    headers: HEADERS,
    withCredentials: true
})

export const apiPrivate = axios.create({
    baseURL: BASE_URL,
    headers: HEADERS,
    withCredentials: true
})

export default api