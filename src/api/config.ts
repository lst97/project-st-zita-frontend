export const API_VERSION = 'v1';
export const PORT = process.env.API_PORT || 1168;
export const HOST = process.env.API_HOST || 'lst97.tplinkdns.com';
export const API_ENDPOINT = `/api/${API_VERSION}`;
export const API_BASE_URL = `${process.env.API_PROTOCOL || 'https'}://${HOST}:${PORT}${API_ENDPOINT}`;

export const API_ENDPOINTS = {
    fetchStaffsData: `${API_BASE_URL}/staffs`,
    createStaff: `${API_BASE_URL}/staffs`,
    updateStaff: `${API_BASE_URL}/staffs/edit`,
    fetchAppointmentsData: `${API_BASE_URL}/appointments/week_view/{weekViewId}`,
    fetchAppointmentsDataByLinkId: `${API_BASE_URL}/shared_appointments/{linkId}?weekViewId={weekViewId}`,
    fetchAppointmentsExcelFile: `${API_BASE_URL}/appointments/export/excel`,
    createAppointments: `${API_BASE_URL}/appointments`,
    createShareAppointmentsLink: `${API_BASE_URL}/appointments/share`,
    deleteAppointmentsByWeekViewIdAndStaffName: `${API_BASE_URL}/appointments/week_view/{weekViewId}?staffName={staffName}`,
    deleteStaff: `${API_BASE_URL}/staffs?staffName={staffName}`,
    signIn: `${API_BASE_URL}/auth/signin`,
    register: `${API_BASE_URL}/auth/register`
};
