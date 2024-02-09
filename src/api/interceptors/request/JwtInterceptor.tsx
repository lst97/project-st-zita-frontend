import apiService from '../../../services/ApiService';
import { AccessTokenService } from '../../../services/TokenService';

export function useJwtInterceptor() {
    apiService.AxiosInstance.interceptors.request.use(
        (config) => {
            const accessToken = AccessTokenService.getToken();

            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
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
