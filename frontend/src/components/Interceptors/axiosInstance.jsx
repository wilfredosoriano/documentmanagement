import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;

        if(error.response.status === 401 && !originalRequest._retry){
            originalRequest._retry = true;

            try {
                
                const refresResponse = await axios.post(`${import.meta.env.VITE_API_URL}/users/refreshToken`, {}, { withCredentials: true });
                const newAccessToken = refresResponse.data.accessToken;

                sessionStorage.setItem('accessToken', newAccessToken);

                originalRequest.headers['Authorization'] = newAccessToken;

                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error('Refresh token expired or invalid', refreshError);
                logoutUser();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;