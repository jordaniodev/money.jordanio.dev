import axios from 'axios';

console.log(process.env)
export const api = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL
})