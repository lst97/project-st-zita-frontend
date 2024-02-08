export const API_VERSION = 'v1';
export const PORT = 1168;
export const HOST = '127.0.0.1';
export const API_ENDPOINT = `/api/${API_VERSION}`;
export const API_BASE_URL = `http://${HOST}:${PORT}${API_ENDPOINT}`;

export const API_ENDPOINTS = {
    fetchStaffsData: `${API_BASE_URL}/staffs`,
    createStaff: `${API_BASE_URL}/staffs`,
    fetchAppointmentsData: `${API_BASE_URL}/appointments/week_view/{weekViewId}`,
    createAppointments: `${API_BASE_URL}/appointments`,
    deleteAppointmentsByWeekViewIdAndStaffName: `${API_BASE_URL}/appointments/week_view/{weekViewId}?staffName={staffName}`,
    deleteStaff: `${API_BASE_URL}/staffs?staffName={staffName}`
};
