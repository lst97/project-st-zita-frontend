export const API_VERSION = 'v1';
export const PORT = 1168;
export const HOST = 'localhost';
export const API_ENDPOINT = `/api/${API_VERSION}`;
export const API_BASE_URL = `http://${HOST}:${PORT}${API_ENDPOINT}`;

export const API_ENDPOINTS = {
    fetchUsersData: `${API_BASE_URL}/users`,
    createUser: `${API_BASE_URL}/users`,
    fetchAppointmentsData: `${API_BASE_URL}/appointments/week_view/{weekViewId}`,
    createAppointments: `${API_BASE_URL}/appointments`,
    deleteAppointmentsForEntireWeek: `${API_BASE_URL}/appointments/week_view/{weekViewId}`
};
