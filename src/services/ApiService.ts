import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../api/config';
import { formatUrl } from '../utils/FormatterUtils';
import { AppointmentData } from '../models/share/scheduler/StaffAppointmentData';
import StaffData from '../models/share/scheduler/StaffData';
import moment from 'moment-timezone';

import { SelectedSchedule } from '../models/scheduler/ScheduleModel';
import { v4 as uuidv4 } from 'uuid';
import { sortDates, groupContinuesTime } from '../utils/SchedulerHelpers';
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

export class StaffApiService {
    static async fetchStaffData() {
        try {
            const response = await apiService.get(
                API_ENDPOINTS.fetchStaffsData
            );
            return response.data as StaffData[];
        } catch (error) {
            throw error;
        }
    }

    static async createStaff(staff: StaffData) {
        try {
            await apiService.post(API_ENDPOINTS.createStaff, staff);
        } catch (error) {
            throw error;
        }
    }

    static async deleteStaff(staffName: string) {
        try {
            const url = formatUrl(API_ENDPOINTS.deleteStaff, {
                staffName: staffName
            });
            await apiService.delete(url);
        } catch (error) {
            throw error;
        }
    }
}
export class AppointmentApiService {
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

    static async replaceAppointmentsData(
        staffName: string,
        weekViewId: string,
        selectedSchedule: SelectedSchedule
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
            throw error;
        }
    }

    static async createAppointmentsData(
        staffName: string,
        weekViewId: string,
        selectedSchedule: SelectedSchedule
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
        } catch (error) {
            throw error;
        }
    }
}

export default apiService;
