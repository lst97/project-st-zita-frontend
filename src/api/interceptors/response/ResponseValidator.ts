import apiService from '../../../services/ApiService';
import { AccessTokenService } from '../../../services/TokenService';

export function useResponseStructureValidationInterceptor() {
    apiService.AxiosInstance.interceptors.response.use(
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
