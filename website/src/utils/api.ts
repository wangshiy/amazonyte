import axios, { AxiosRequestConfig } from "axios";

const config: AxiosRequestConfig = {
  baseURL: `https://api.pinata.cloud`,
  headers: {
    pinata_api_key: process.env.REACT_APP_PINATA_API_KEY as string,
    pinata_secret_api_key: process.env
      .REACT_APP_PINATA_SECRET_API_KEY as string,
  },
};

const axiosInstance = axios.create(config);

axiosInstance.interceptors.response.use((res) => {
  return res.data;
});

export default axiosInstance;
