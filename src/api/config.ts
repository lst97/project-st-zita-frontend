export const API_VERSION = 'v1';
export const PORT = 1168;
export const HOST = 'lst97.tplinkdns.com';
export const API_ENDPOINT = `/api/${API_VERSION}`;
export const API_BASE_URL = `https://${HOST}:${PORT}${API_ENDPOINT}`;

export const API_ENDPOINTS = {
    fetchStaffsData: `${API_BASE_URL}/staffs`,
    createStaff: `${API_BASE_URL}/staffs`,
    fetchAppointmentsData: `${API_BASE_URL}/appointments/week_view/{weekViewId}`,
    createAppointments: `${API_BASE_URL}/appointments`,
    deleteAppointmentsByWeekViewIdAndStaffName: `${API_BASE_URL}/appointments/week_view/{weekViewId}?staffName={staffName}`,
    deleteStaff: `${API_BASE_URL}/staffs?staffName={staffName}`,
    signIn: `${API_BASE_URL}/auth/signin`,
    register: `${API_BASE_URL}/auth/register`
};
