import { NavigateFunction } from 'react-router-dom';
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
import { CreateShareLinkForm } from '../models/forms/scheduler/CreateShareLinkForm';
import { InvalidAppointmentShareLinkId } from '../models/errors/ApiErrors';
import messageCodes from '../models/share/api/MessageCodes.json';

export class ApiAuthenticationErrorHandler implements IApiErrorHandler {
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
export interface IApiErrorHandler {
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

class ApiResultIndicator {
    public static showIndicator?: (
        isLoading: boolean,
        isSuccess: boolean
    ) => void;

    public static useIndicator(
        showIndicator: (isLoading: boolean, isSuccess: boolean) => void
    ) {
        this.showIndicator = showIndicator;
    }
}
export class StaffApiService extends ApiResultIndicator {
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
            if (this.showIndicator) {
                this.showIndicator(true, false);
            }

            await apiService.post(API_ENDPOINTS.createStaff, createStaffForm);

            if (this.showIndicator) {
                this.showIndicator(false, true);
            }
        } catch (error) {
            if (this.showIndicator) {
                this.showIndicator(false, false);
            }

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
            if (this.showIndicator) {
                this.showIndicator(true, false);
            }

            const url = formatUrl(API_ENDPOINTS.deleteStaff, {
                staffName: staffName
            });
            await apiService.delete(url);

            if (this.showIndicator) {
                this.showIndicator(false, true);
            }

            return true;
        } catch (error) {
            if (this.showIndicator) {
                this.showIndicator(false, false);
            }

            apiErrorHandler.handleError(error);
            errorHandler?.handleError(error);
            return false;
        }
    }
}
export class AppointmentApiService extends ApiResultIndicator {
    static async fetchAppointmentsWeekViewData({
        id,
        linkId,
        errorHandler
    }: {
        id: string;
        linkId?: string;
        errorHandler?: IApiErrorHandler;
    }): Promise<AppointmentData[]> {
        try {
            let url;
            if (linkId) {
                url = formatUrl(API_ENDPOINTS.fetchAppointmentsDataByLinkId, {
                    weekViewId: id,
                    linkId: linkId
                });
            } else {
                // not using weekViewId in the url as query param
                url = formatUrl(API_ENDPOINTS.fetchAppointmentsData, {
                    weekViewId: id
                }).split('?')[0];
            }
            const response = await apiService.get(url);
            if (!response.data) {
                // invalid linkId
                throw new InvalidAppointmentShareLinkId('Invalid linkId');
            }
            return response.data as AppointmentData[];
        } catch (error) {
            if (error instanceof InvalidAppointmentShareLinkId) {
                throw error;
            }
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
            if (this.showIndicator) {
                this.showIndicator(true, false);
            }
            const url = formatUrl(
                API_ENDPOINTS.deleteAppointmentsByWeekViewIdAndStaffName,
                {
                    weekViewId: weekViewId,
                    staffName: staffName
                }
            );

            await apiService.delete(url);

            await AppointmentApiService.createAppointmentsData(
                staffName,
                weekViewId,
                selectedSchedule
            );

            if (this.showIndicator) {
                this.showIndicator(false, true);
            }
        } catch (error) {
            if (this.showIndicator) {
                this.showIndicator(false, false);
            }
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

    static async createShareAppointments(
        permission: string,
        weekViewIds?: string[],
        expiry?: string
    ) {
        const createShareLinkForm = new CreateShareLinkForm({
            permission: permission,
            weekViewIds: weekViewIds,
            expiry: expiry
        });

        try {
            const response = await apiService.post(
                API_ENDPOINTS.createShareAppointmentsLink,
                createShareLinkForm
            );
            return response.data;
        } catch (error) {
            apiErrorHandler.handleError(error);
            return null;
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

interface ResponseMessages {
    [key: string]: {
        [key: string]: ResponseMessage;
    };
}

export class ResponseMessage {
    Code: string;
    Message: string;
    StatusCode: number;

    constructor(code: string, message: string, statusCode: number) {
        this.Code = code;
        this.Message = message;
        this.StatusCode = statusCode;
    }
}

export class MessageCodeService {
    public readonly Messages: ResponseMessages = messageCodes;

    public getResponseMessageByCode(code: string): ResponseMessage | undefined {
        for (const category in this.Messages) {
            if (Object.prototype.hasOwnProperty.call(this.Messages, category)) {
                const responseMessages = this.Messages[category];
                for (const key in responseMessages) {
                    if (
                        Object.prototype.hasOwnProperty.call(
                            responseMessages,
                            key
                        )
                    ) {
                        const responseMessage = responseMessages[key];
                        if (responseMessage.Code === code) {
                            return responseMessage;
                        }
                    }
                }
            }
        }
        return undefined;
    }
}

export default apiService;
