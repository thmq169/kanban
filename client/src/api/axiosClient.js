import axios from "axios";
import queryString from "query-string";

const backendUrl = "https://kanban-api-kappa.vercel.app/api/v1/";
const getToken = () => localStorage.getItem("token");

const axiosClient = axios.create({
  baseURL: backendUrl,
  paramsSerializer: (param) => queryString.stringify({ param }),
});

axiosClient.interceptors.request.use((config) => {
  return {
    ...config,
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${getToken()}`,
    },
  };
});

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) return response.data;
    return response;
  },
  (err) => {
    if (!err.response) {
      return alert(err);
    }

    throw err.response;
  }
);

export default axiosClient;
