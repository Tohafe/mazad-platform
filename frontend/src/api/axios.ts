import axios from "axios"


//for frontend Dev, remove it before push @Naoufal
//const BASE_URL = '/api/v1'
const MAZAD_IP = import.meta.env.VITE_MAZAD_IP;
const BASE_URL = `https://${MAZAD_IP}:443/api/v1`

const HEADERS = {
    "Content-Type": "application/json",
    "Accept": "application/json"
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