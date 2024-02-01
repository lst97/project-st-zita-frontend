import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../api/config';
import { formatUrl } from '../utils/FormatterUtils';
import { AppointmentData } from '../models/share/AppointmentData';
import { UserData } from '../models/share/UserData';
import moment from 'moment-timezone';

import {
    SelectedSchedule,
    StaffScheduleMap
} from '../models/scheduler/ScheduleModel';
import { v4 as uuidv4 } from 'uuid';
import {
    parseAndSortDate,
    groupContinuesTime,
    dateGroupToAppointments
} from '../utils/SchedulerHelpers';
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
            return response.data as UserData[];
        } catch (error) {
            throw error;
        }
    }

    static async fetchAppointmentsWeekViewData(
        id: string
    ): Promise<AppointmentData[]> {
        try {
            const url = formatUrl(API_ENDPOINTS.fetchAppointmentsData, {
                weekViewId: id
            });
            const response = await apiService.get(url);
            return response.data as AppointmentData[];
        } catch (error) {
            throw error;
        }
    }

    static async createAppointmentsData(
        staffName: string,
        weekViewId: string,
        selectedSchedule: SelectedSchedule
    ) {
        const appointmentsData = new Array<AppointmentData>();

        let sortedDateString = parseAndSortDate(selectedSchedule.schedule);
        let groupedDates = groupContinuesTime(sortedDateString);

        for (const group of groupedDates) {
            const appointmentData = new AppointmentData(
                staffName,
                uuidv4(),
                weekViewId,
                '',
                moment(group[0]).tz('Australia/Melbourne').format(),
                moment(group[group.length - 1])
                    .tz('Australia/Melbourne')
                    .format()
            );
            appointmentsData.push(appointmentData);
        }

        try {
            await apiService.post(
                API_ENDPOINTS.createAppointments,
                appointmentsData
            );
        } catch (error) {
            throw error;
        }
    }
}

export default apiService;
