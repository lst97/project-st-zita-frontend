import { Config as ApiServiceConfig } from '@lst97/common-restful';
import axios from 'axios';

/**
 * Represents the configuration for the API.
 */
export class ApiConfig {
    private static _instance: ApiConfig;
    private _routes: { [key: string]: URL } = {};

    private constructor() {}

    static get instance(): ApiConfig {
        if (!this._instance) {
            this._instance = new ApiConfig();
        }
        return this._instance;
    }

    public get routes(): { [key: string]: URL } {
        return this._routes;
    }
    public init({
        host,
        port,
        protocol,
        apiVersion,
        projectName
    }: {
        host?: string;
        port?: number;
        protocol?: 'http' | 'https';
        apiVersion?: string;
        projectName?: string;
    } = {}) {
        ApiServiceConfig.instance().init({
            projectName: projectName || 'stzita',
            host: host || '127.0.0.1',
            port: port || 1168,
            protocol: protocol || 'http',
            apiVersion: apiVersion || 'v1',
            axiosInstance: axios
        });
        const baseUrl = ApiServiceConfig.instance().baseUrl + '/';
        this._routes = {
            fetchStaffsData: new URL('staffs', baseUrl),
            createStaff: new URL('staffs', baseUrl),
            updateStaff: new URL('staffs/edit', baseUrl),
            fetchAppointmentsData: new URL(
                'appointments/week_view/{weekViewId}',
                baseUrl
            ),
            fetchAppointmentsDataByLinkId: new URL(
                'shared_appointments/{linkId}?weekViewId={weekViewId}',
                baseUrl
            ),
            fetchAppointmentsExcelFile: new URL(
                'appointments/export/excel',
                baseUrl
            ),
            createAppointments: new URL('appointments', baseUrl),
            createShareAppointmentsLink: new URL('appointments/share', baseUrl),
            deleteAppointmentsByWeekViewIdAndStaffName: new URL(
                'appointments/week_view/{weekViewId}?staffName={staffName}',
                baseUrl
            ),
            deleteAppointmentByDateAndStaffName: new URL(
                'appointments?startDate={startDate}&endDate={endDate}&staffName={staffName}',
                baseUrl
            ),
            deleteStaff: new URL('staffs?staffName={staffName}', baseUrl),
            signIn: new URL('auth/signin', baseUrl),
            register: new URL('auth/register', baseUrl)
        };
    }
}
