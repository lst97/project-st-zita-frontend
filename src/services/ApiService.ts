import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../api/config';
import UserData from '../models/share/UserData';
class ApiService {
    private _axiosInstance;

    constructor() {
        this._axiosInstance = axios.create({
            baseURL: `${API_BASE_URL}`
        });
    }

    get AxiosInstance() {
        return this._axiosInstance;
    }

    async get(url: string, config = {}) {
        try {
            const response = await this._axiosInstance.get(url, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async post(url: string, data: any, config = {}) {
        try {
            const response = await this._axiosInstance.post(url, data, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async put(url: string, data: any, config = {}) {
        try {
            const response = await this._axiosInstance.put(url, data, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async delete(url: string, config = {}) {
        try {
            const response = await this._axiosInstance.delete(url, config);
            return response.data; // Note: Some DELETE operations might not return a body.
        } catch (error) {
            throw error;
        }
    }
}

const apiService = new ApiService();

export class UserApiService {
    static async fetchUserData() {
        try {
            const response = await apiService.get(API_ENDPOINTS.fetchUsersData);
            return response.data as UserData;
        } catch (error) {
            throw error;
        }
    }
}

export default apiService;
