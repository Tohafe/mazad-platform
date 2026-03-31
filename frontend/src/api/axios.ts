import axios from "axios"

const BASE_URL = '/api/v1'

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