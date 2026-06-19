import axios from "axios";

const API_URL = "http://localhost:8081/consumer";

export const getProducts = () => {
    return axios.get(API_URL);
};