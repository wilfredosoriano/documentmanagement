import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api',
});

axiosInstance.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;

        if(error.response.status === 401 && !originalRequest._retry){
            originalRequest._retry = true;

            try {
                
                const refresResponse = await axios.post('/api/users/refreshToken');
                const newAccessToken = refresResponse.data.accessToken;

                sessionStorage.setItem('accessToken', newAccessToken);

                originalRequest.headers['Authorization'] = newAccessToken;

                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error('Refresh token expired or invalid', refreshError);
                return Promise.reject(refreshError);
            }
        }
    }
);

export default axiosInstance;