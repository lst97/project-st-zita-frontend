import { AppointmentData } from '../models/share/scheduler/StaffAppointmentData';
import StaffData from '../models/share/scheduler/StaffData';

import { SelectedSchedule } from '../models/scheduler/ScheduleModel';
import { v4 as uuidv4 } from 'uuid';
import { sortDates, groupContinuesTime } from '../utils/SchedulerHelpers';
import {
    CreateStaffForm,
    UpdateStaffForm
} from '../models/forms/scheduler/StaffForms';
import { SignInForm } from '../models/forms/auth/SignInForm';
import { CreateShareLinkForm } from '../models/forms/scheduler/CreateShareLinkForm';
import { InvalidAppointmentShareLinkId } from '../models/errors/ApiErrors';
import messageCodes from '../models/share/api/MessageCodes.json';
import BackendStandardResponse from '../models/share/api/response';
import {
    RegistrationForm,
    RegistrationFormParams
} from '../models/forms/auth/RegistrationForm';
import {
    ApiResultIndicator,
    ApiServiceInstance,
    ConsoleLogApiErrorHandler,
    IApiErrorHandler,
    formatRoutes
} from '@lst97/common-restful';
import { ApiConfig } from '../api/config';

const defaultApiErrorHandler = new ConsoleLogApiErrorHandler();
export class StaffApiService extends ApiResultIndicator {
    static async fetchStaffData(...errorHandlers: IApiErrorHandler[]) {
        try {
            const response = await ApiServiceInstance().get(
                ApiConfig.instance.routes.fetchStaffsData.toString()
            );

            return response.data as StaffData[];
        } catch (error) {
            defaultApiErrorHandler.handleError(error);
            for (const errorHandler of errorHandlers) {
                errorHandler.handleError(error);
            }
            return [];
        }
    }

    static async createStaff(
        staff: StaffData,
        ...errorHandlers: IApiErrorHandler[]
    ) {
        const createStaffForm = new CreateStaffForm({
            staffName: staff.name,
            email: staff.email === '' ? undefined : staff.email,
            color: staff.color,
            phoneNumber:
                staff.phoneNumber === '' ? undefined : staff.phoneNumber
        });

        try {
            if (this.showIndicator) {
                this.showIndicator(true, false);
            }

            const response = await ApiServiceInstance().post(
                ApiConfig.instance.routes.createStaff.toString(),
                createStaffForm
            );

            if (this.showIndicator) {
                this.showIndicator(false, true);
            }

            return response as BackendStandardResponse<StaffData>;
        } catch (error) {
            if (this.showIndicator) {
                this.showIndicator(false, false);
            }

            defaultApiErrorHandler.handleError(error);
            for (const errorHandler of errorHandlers) {
                errorHandler.handleError(error);
            }
            return null;
        }
    }

    static async updateStaff(
        staffData: StaffData,
        ...errorHandlers: IApiErrorHandler[]
    ) {
        const updateStaffForm = new UpdateStaffForm(staffData.id, {
            staffName: staffData.name,
            image: staffData.image === '' ? undefined : staffData.image,
            color: staffData.color,
            email: staffData.email === '' ? undefined : staffData.email,
            phoneNumber:
                staffData.phoneNumber === '' ? undefined : staffData.phoneNumber
        });

        try {
            if (this.showIndicator) {
                this.showIndicator(true, false);
            }

            await ApiServiceInstance().put(
                formatRoutes(ApiConfig.instance.routes.updateStaff.toString(), {
                    staffName: staffData.name
                }),
                updateStaffForm
            );

            if (this.showIndicator) {
                this.showIndicator(false, true);
            }
        } catch (error) {
            if (this.showIndicator) {
                this.showIndicator(false, false);
            }

            defaultApiErrorHandler.handleError(error);
            for (const errorHandler of errorHandlers) {
                errorHandler.handleError(error);
            }

            return null;
        }
    }

    static async deleteStaff(
        staffName: string,
        ...errorHandlers: IApiErrorHandler[]
    ) {
        try {
            if (this.showIndicator) {
                this.showIndicator(true, false);
            }

            const url = formatRoutes(
                ApiConfig.instance.routes.deleteStaff.toString(),
                {
                    staffName: staffName
                }
            );
            await ApiServiceInstance().delete(url);

            if (this.showIndicator) {
                this.showIndicator(false, true);
            }

            return true;
        } catch (error) {
            if (this.showIndicator) {
                this.showIndicator(false, false);
            }

            defaultApiErrorHandler.handleError(error);
            for (const errorHandler of errorHandlers) {
                errorHandler.handleError(error);
            }

            return false;
        }
    }
}
export class AppointmentApiService extends ApiResultIndicator {
    static async fetchAppointmentsWeekViewData(
        {
            id,
            linkId
        }: {
            id: string;
            linkId?: string;
        },
        ...errorHandlers: IApiErrorHandler[]
    ): Promise<AppointmentData[]> {
        try {
            let url;
            if (linkId) {
                url = formatRoutes(
                    ApiConfig.instance.routes.fetchAppointmentsDataByLinkId.toString(),
                    {
                        weekViewId: id,
                        linkId: linkId
                    }
                );
            } else {
                // not using weekViewId in the url as query param
                url = formatRoutes(
                    ApiConfig.instance.routes.fetchAppointmentsData.toString(),
                    {
                        weekViewId: id
                    }
                ).split('?')[0];
            }
            const response = await ApiServiceInstance().get(url);
            if (!response.data) {
                // invalid linkId
                throw new InvalidAppointmentShareLinkId('Invalid linkId');
            }
            return response.data as AppointmentData[];
        } catch (error) {
            if (error instanceof InvalidAppointmentShareLinkId) {
                throw error;
            }
            defaultApiErrorHandler.handleError(error);
            if (Array.isArray(errorHandlers)) {
                for (const errorHandler of errorHandlers) {
                    errorHandler.handleError(error);
                }
            }
            return [];
        }
    }

    static async deleteAppointmentByDateAndStaffName(
        staffName: string,
        startDate: Date,
        endDate: Date,
        ...errorHandlers: IApiErrorHandler[]
    ) {
        try {
            if (this.showIndicator) {
                this.showIndicator(true, false);
            }

            const url = formatRoutes(
                ApiConfig.instance.routes.deleteAppointmentByDateAndStaffName.toString(),
                {
                    staffName: staffName,
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString()
                }
            );

            await ApiServiceInstance().delete(url);

            if (this.showIndicator) {
                this.showIndicator(false, true);
            }
        } catch (error) {
            if (this.showIndicator) {
                this.showIndicator(false, false);
            }
            defaultApiErrorHandler.handleError(error);

            for (const errorHandler of errorHandlers) {
                errorHandler.handleError(error);
            }
            return false;
        }
    }

    static async replaceAppointmentsData(
        staffName: string,
        weekViewId: string,
        selectedSchedule: SelectedSchedule,
        ...errorHandlers: IApiErrorHandler[]
    ) {
        try {
            if (this.showIndicator) {
                this.showIndicator(true, false);
            }
            const url = formatRoutes(
                ApiConfig.instance.routes.deleteAppointmentsByWeekViewIdAndStaffName.toString(),
                {
                    weekViewId: weekViewId,
                    staffName: staffName
                }
            );

            await ApiServiceInstance().delete(url);

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
            defaultApiErrorHandler.handleError(error);

            for (const errorHandler of errorHandlers) {
                errorHandler.handleError(error);
            }
            return false;
        }
    }

    static async createAppointmentsData(
        staffName: string,
        weekViewId: string,
        selectedSchedule: SelectedSchedule,
        ...errorHandlers: IApiErrorHandler[]
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
                groupId: uuidv4(), //TODO: should be handled by the backend
                weekViewId: weekViewId,
                startDate: group[0].toISOString(),
                endDate: group[group.length - 1].toISOString()
            });
            appointmentsData.push(appointmentData);
        }

        try {
            await ApiServiceInstance().post(
                ApiConfig.instance.routes.createAppointments.toString(),
                appointmentsData
            );

            return true;
        } catch (error) {
            defaultApiErrorHandler.handleError(error);
            for (const errorHandler of errorHandlers) {
                errorHandler.handleError(error);
            }
            return false;
        }
    }

    static async createShareAppointments(
        permission: string,
        weekViewIds?: string[],
        expiry?: string,
        ...errorHandlers: IApiErrorHandler[]
    ) {
        const createShareLinkForm = new CreateShareLinkForm({
            permission: permission,
            weekViewIds: weekViewIds,
            expiry: expiry
        });

        try {
            const response = await ApiServiceInstance().post(
                ApiConfig.instance.routes.createShareAppointmentsLink.toString(),
                createShareLinkForm
            );
            return response;
        } catch (error) {
            defaultApiErrorHandler.handleError(error);
            for (const errorHandler of errorHandlers) {
                errorHandler.handleError(error);
            }
            return null;
        }
    }

    static async exportAsExcel(
        fromDate: Date,
        toDate: Date,
        method: 'weekly' | 'monthly' | 'yearly',
        ...errorHandlers: IApiErrorHandler[]
    ) {
        try {
            const response = await ApiServiceInstance().post(
                ApiConfig.instance.routes.fetchAppointmentsExcelFile.toString(),
                {
                    fromDate: fromDate.toISOString(),
                    toDate: toDate.toISOString(),
                    method: method
                }
            );

            return response;
        } catch (error) {
            defaultApiErrorHandler.handleError(error);
            for (const errorHandler of errorHandlers) {
                errorHandler.handleError(error);
            }
            return null;
        }
    }
}

export class AuthApiService {
    static async signIn(
        email: string,
        password: string,
        ...errorHandlers: IApiErrorHandler[]
    ) {
        const signInForm = new SignInForm({
            email: email,
            password: password
        });
        console.log(ApiConfig.instance.routes.signIn.toString());
        try {
            const response = await ApiServiceInstance().post(
                ApiConfig.instance.routes.signIn.toString(),
                signInForm
            );
            return response.data;
        } catch (error) {
            defaultApiErrorHandler.handleError(error);
            for (const errorHandler of errorHandlers) {
                errorHandler.handleError(error);
            }
            return null;
        }
    }

    static async signUp(
        params: RegistrationFormParams,
        ...errorHandlers: IApiErrorHandler[]
    ) {
        const signUpForm = new RegistrationForm(params);

        try {
            const response = await ApiServiceInstance().post(
                ApiConfig.instance.routes.register.toString(),
                signUpForm
            );
            return response.data;
        } catch (error) {
            defaultApiErrorHandler.handleError(error);
            for (const errorHandler of errorHandlers) {
                errorHandler.handleError(error);
            }
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
