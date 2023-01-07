import axios from "axios"
const axiosInstance = axios.create();


axiosInstance.interceptors.request.use(
    async (config) => {
        config.headers = {
            Authorization: localStorage.getItem("token"),
        };
        return config;
    },
    (error) => {
        Promise.reject(error);
    }
);

export default axiosInstance;