// src/utils/axios.ts
import axios from 'axios';

const API = axios.create({
    // Aapka backend local server URL
    baseURL: 'http://localhost:8000/api/v1', 
    // Cookies ko frontend se backend bhejne ke liye zaroori hai
    withCredentials: true, 
    headers: {
        'Content-Type': 'application/json',
    }
});

export default API;