import axios from "axios";

export default axios.create({
    baseURL : process.env.BASE_URL, // API URL
    withCredentials: true,
});