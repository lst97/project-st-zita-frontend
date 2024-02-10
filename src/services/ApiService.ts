import { NavigateFunction, useNavigate } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../api/config';
import { formatUrl } from '../utils/FormatterUtils';
import { AppointmentData } from '../models/share/scheduler/StaffAppointmentData';
import StaffData from '../models/share/scheduler/StaffData';

import { SelectedSchedule } from '../models/scheduler/ScheduleModel';
import { v4 as uuidv4 } from 'uuid';
import { sortDates, groupContinuesTime } from '../utils/SchedulerHelpers';
import { CreateStaffForm } from '../models/forms/scheduler/CreateStaffForm';
import { SignInForm } from '../models/forms/auth/SignInForm';
import { AccessTokenService } from './TokenService';

export class ApiAuthenticationErrorHandler {
    private navigate?: NavigateFunction;
    private showSnackbar?: (message: string, severity: 'error') => void;

    public handleError(error: any): void {
        if (error.response) {
            this.handleServerError(error.response);
        }
    }

    public useNavigate(navigate: NavigateFunction) {
        this.navigate = navigate;
    }

    public useSnackbar(
        showSnackbar: (message: string, severity: 'error') => void
    ) {
        this.showSnackbar = showSnackbar;
    }

    private handleServerError(response: AxiosResponse) {
        switch (response.status) {
            case 401:
            case 403:
                AccessTokenService.removeToken();
                if (this.navigate) {
                    this.navigate('/signin', { replace: true });
                }

                if (this.showSnackbar) {
                    this.showSnackbar(
                        'Session expired. Please sign in again',
                        'error'
                    );
                }

                break;
        }
    }
}
interface IApiErrorHandler {
    handleError(error: any): void;
}
class ApiErrorHandler implements IApiErrorHandler {
    public handleError(error: any): void {
        // Centralized logic for handling all API errors
        if (error.response) {
            // The request was made and the server responded with a status code outside of the 2xx range
            this.handleServerError(error.response);
        } else if (error.request) {
            // The request was made but no response was received. Network issue, timeout, etc.
            console.error('Network Error:', error.request);
            // You might want to display a generic network error message to the user
        } else {
            // Something happened in setting up the request
            console.error('Unexpected API Error:', error.message);
        }
    }

    private handleServerError(response: AxiosResponse) {
        switch (response.status) {
            case 400:
                console.error('Bad Request:', response.data);
                // Handle specific 400 errors with user-friendly messages
                break;
            // ... other cases
            default:
                console.error('Generic Server Error:', response.data);
        }
    }
}
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
const apiErrorHandler = new ApiErrorHandler();

export class StaffApiService {
    static async fetchStaffData(errorHandler?: IApiErrorHandler) {
        try {
            const response = await apiService.get(
                API_ENDPOINTS.fetchStaffsData
            );
            return response.data as StaffData[];
        } catch (error) {
            apiErrorHandler.handleError(error);
            errorHandler?.handleError(error);
            return [];
        }
    }

    static async createStaff(
        staff: StaffData,
        errorHandler?: IApiErrorHandler
    ) {
        const createStaffForm = new CreateStaffForm({
            staffName: staff.name,
            email: staff.email,
            color: staff.color,
            phoneNumber: staff.phoneNumber
        });

        try {
            await apiService.post(API_ENDPOINTS.createStaff, createStaffForm);
        } catch (error) {
            apiErrorHandler.handleError(error);
            errorHandler?.handleError(error);
            return null;
        }
    }

    static async deleteStaff(
        staffName: string,
        errorHandler?: IApiErrorHandler
    ) {
        try {
            const url = formatUrl(API_ENDPOINTS.deleteStaff, {
                staffName: staffName
            });
            await apiService.delete(url);
            return true;
        } catch (error) {
            apiErrorHandler.handleError(error);
            errorHandler?.handleError(error);
            return false;
        }
    }
}
export class AppointmentApiService {
    static async fetchAppointmentsWeekViewData(
        id: string,
        errorHandler?: IApiErrorHandler
    ): Promise<AppointmentData[]> {
        try {
            const url = formatUrl(API_ENDPOINTS.fetchAppointmentsData, {
                weekViewId: id
            });
            const response = await apiService.get(url);
            return response.data as AppointmentData[];
        } catch (error) {
            apiErrorHandler.handleError(error);
            errorHandler?.handleError(error);
            return [];
        }
    }

    static async replaceAppointmentsData(
        staffName: string,
        weekViewId: string,
        selectedSchedule: SelectedSchedule,
        errorHandler?: IApiErrorHandler
    ) {
        try {
            const url = formatUrl(
                API_ENDPOINTS.deleteAppointmentsByWeekViewIdAndStaffName,
                {
                    weekViewId: weekViewId,
                    staffName: staffName
                }
            );

            await apiService.delete(url);

            AppointmentApiService.createAppointmentsData(
                staffName,
                weekViewId,
                selectedSchedule
            );
        } catch (error) {
            apiErrorHandler.handleError(error);
            errorHandler?.handleError(error);
            return false;
        }
    }

    static async createAppointmentsData(
        staffName: string,
        weekViewId: string,
        selectedSchedule: SelectedSchedule,
        errorHandler?: IApiErrorHandler
    ) {
        const appointmentsData = [];
        if (selectedSchedule.schedule.length === 0) {
            return;
        }

        let sortedDateString = sortDates(selectedSchedule.schedule);
        let groupedDates = groupContinuesTime(sortedDateString);

        for (const group of groupedDates) {
            const appointmentData = new AppointmentData({
                staffName: staffName,
                groupId: uuidv4(),
                weekViewId: weekViewId,
                startDate: group[0].toISOString(),
                endDate: group[group.length - 1].toISOString()
            });
            appointmentsData.push(appointmentData);
        }

        try {
            await apiService.post(
                API_ENDPOINTS.createAppointments,
                appointmentsData
            );

            return true;
        } catch (error) {
            apiErrorHandler.handleError(error);
            errorHandler?.handleError(error);
            return false;
        }
    }
}

export class AuthApiService {
    static async signIn(email: string, password: string) {
        const signInForm = new SignInForm({
            email: email,
            password: password
        });

        try {
            const response = await apiService.post(
                API_ENDPOINTS.signIn,
                signInForm
            );
            return response.data;
        } catch (error) {
            apiErrorHandler.handleError(error);
            return null;
        }
    }
}

export default apiService;
