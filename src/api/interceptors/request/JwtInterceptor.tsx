import apiService from '../../../services/ApiService';

export function useJwtInterceptor() {
    apiService.AxiosInstance.interceptors.request.use(
        (config) => {
            localStorage.setItem('token', '__RESERVED__');

            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );
}

// Response interceptor example
// axiosInstance.interceptors.response.use(
//     (response) => {
//         // Any status code within the range of 2xx cause this function to trigger
//         return response;
//     },
//     (error) => {
//         // Any status codes outside the range of 2xx cause this function to trigger
//         return Promise.reject(error);
//     }
// );
