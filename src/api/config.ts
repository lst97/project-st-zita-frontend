import { Config as ApiServiceConfig } from '@lst97/common-restful';
import axios from 'axios';

/**
 * Represents the configuration for the API.
 */
export class ApiConfig {
    private static _instance: ApiConfig;
    private _routes: { [key: string]: string } = {};

    private constructor() {}

    static get instance(): ApiConfig {
        if (!this._instance) {
            this._instance = new ApiConfig();
        }
        return this._instance;
    }

    public get routes(): { [key: string]: string } {
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
        const baseUrl = ApiServiceConfig.instance().baseUrl;
        this._routes = {
            fetchStaffsData: `${baseUrl}/staffs`,
            createStaff: `${baseUrl}/staffs`,
            updateStaff: `${baseUrl}/staffs/edit`,
            fetchAppointmentsData: `${baseUrl}/appointments/week_view/{weekViewId}`,
            fetchAppointmentsDataByLinkId: `${baseUrl}/shared_appointments/{linkId}?weekViewId={weekViewId}`,
            fetchAppointmentsExcelFile: `${baseUrl}/appointments/export/excel`,
            createAppointments: `${baseUrl}/appointments`,
            createShareAppointmentsLink: `${baseUrl}/appointments/share`,
            deleteAppointmentsByWeekViewIdAndStaffName: `${baseUrl}/appointments/week_view/{weekViewId}?staffName={staffName}`,
            deleteStaff: `${baseUrl}/staffs?staffName={staffName}`,
            signIn: `${baseUrl}/auth/signin`,
            register: `${baseUrl}/auth/register`
        };
    }
}
