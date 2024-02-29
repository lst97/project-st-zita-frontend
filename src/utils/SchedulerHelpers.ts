import {
    SelectedSchedule,
    StaffScheduleMap
} from '../models/scheduler/ScheduleModel';
import StaffAppointment from '../models/scheduler/StaffAppointment';
import { AppointmentData } from '../models/share/scheduler/StaffAppointmentData';
import {
    AppointmentApiService,
    IApiErrorHandler
} from '../services/ApiService';
import { ColorUtils } from './ColorUtils';
import { getISOWeekNumberFromDate } from './DateTimeUtils';

interface FetchAppointmentParams {
    linkId?: string;
    currentDate: Date;
    onUpdate?: (data: StaffScheduleMap) => void;
}

function updateSelectedScheduleMap(
    appointmentsData: AppointmentData[],
    year: number,
    weekNumber: number
): StaffScheduleMap {
    const newSelectedScheduleMap: StaffScheduleMap = {};

    appointmentsData.forEach((appointment) => {
        const staffName = appointment.staffName;

        if (!newSelectedScheduleMap[staffName]) {
            newSelectedScheduleMap[staffName] = new SelectedSchedule(
                year,
                weekNumber,
                []
            );
        }

        populateScheduleForStaff(
            newSelectedScheduleMap[staffName].schedule,
            new Date(appointment.startDate),
            new Date(appointment.endDate)
        );
    });

    return newSelectedScheduleMap;
}

function populateScheduleForStaff(
    schedule: Date[],
    startDateStr: Date,
    endDateStr: Date
) {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    const THIRTY_MINUTES_IN_MS = 30 * 60 * 1000;

    for (
        let tempDate = startDate;
        tempDate <= endDate;
        tempDate = new Date(tempDate.getTime() + THIRTY_MINUTES_IN_MS)
    ) {
        schedule.push(tempDate);
    }
}

export const fetchAppointmentWeekViewData = async (
    params: FetchAppointmentParams,
    ...errorHandlers: IApiErrorHandler[]
) => {
    const weekNumber = getISOWeekNumberFromDate(params.currentDate);
    const year = params.currentDate.getFullYear();
    const weekViewId = calculateWeekViewId(params.currentDate);

    const appointmentsData =
        await AppointmentApiService.fetchAppointmentsWeekViewData(
            {
                linkId: params.linkId,
                id: weekViewId
            },
            ...errorHandlers
        );

    const newSelectedScheduleMap = updateSelectedScheduleMap(
        appointmentsData,
        year,
        weekNumber
    );

    params.onUpdate?.(newSelectedScheduleMap);

    return newSelectedScheduleMap;
};

function _calculateTimeInMinutes(date: Date): number {
    return date.getHours() * 60 + date.getMinutes();
}

const APPOINTMENT_LENGTH_MINUTES = 30; // Each time-slot is 30 minutes
const MILLISECONDS_PER_MINUTE = 60000;

export function calculateDateGroupTotalHours(dateGroups: Date[][]) {
    let totalMinutes = 0;

    for (const dateGroup of dateGroups) {
        // Add 30 minutes for each date in the group
        totalMinutes += dateGroup.length * APPOINTMENT_LENGTH_MINUTES;
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    // Format the total hours and minutes into "HH:MM"
    const totalHours = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

    return totalHours;
}

export function calculateWeekViewId(date: Date): string {
    const year = date.getFullYear().toString();
    const weekNumber = getISOWeekNumberFromDate(date);
    return `${weekNumber}-${year}`;
}

export function sortDates(dates: Date[]) {
    return [...dates].sort((a, b) => a.getTime() - b.getTime());
}

/**
 * Groups dates into arrays where each group's dates are within a specified
 * length of time from each other.
 * @param {Date[]} dates - The array of Date objects to group.
 * @returns {Date[][]} - An array of Date arrays, each representing a group of continuous times.
 */
export function groupContinuesTime(dates: Date[]): Date[][] {
    if (dates?.length === 0) return [];

    const groupedDates = [];
    let currentGroup = [dates[0]];

    for (let i = 1; i < dates.length; i++) {
        const diff =
            (dates[i].getTime() -
                currentGroup[currentGroup.length - 1].getTime()) /
            (1000 * 60); // Difference in minutes

        if (diff <= APPOINTMENT_LENGTH_MINUTES) {
            currentGroup.push(dates[i]);
        } else {
            groupedDates.push(currentGroup);
            currentGroup = [dates[i]];
        }
    }

    if (currentGroup.length > 0) {
        groupedDates.push(currentGroup);
    }

    return groupedDates;
}

export function dateGroupToAppointments(
    staffName: string,
    dateGroup: Date[][],
    opacity?: number
): StaffAppointment[] {
    return dateGroup
        .map((group: Date[], index: number) => {
            if (group.length === 0) return null;

            const startDate = group[0];
            const lastDate = group[group.length - 1];
            const endDate = new Date(
                lastDate.getTime() +
                    APPOINTMENT_LENGTH_MINUTES * MILLISECONDS_PER_MINUTE
            );

            return new StaffAppointment(
                staffName,
                startDate,
                endDate,
                index,
                '',
                ColorUtils.getColorFor(staffName),
                opacity
            );
        })
        .filter((appointment) => appointment !== null) as StaffAppointment[];
}

export function isDateIncluded(dates: Date[], date: Date): boolean {
    return dates.some((cellDate) => cellDate.getTime() === date.getTime());
}

function _generateCellDate(
    baseDate: Date,
    dayOffset: number,
    timeInMinutes: number
): Date {
    // Clone the base date
    const cellDate = new Date(baseDate.getTime());
    cellDate.setDate(cellDate.getDate() + dayOffset);
    cellDate.setHours(Math.floor(timeInMinutes / 60), timeInMinutes % 60);
    return cellDate;
}

function getSelectedCellsFromDragging(
    dragStart: Date,
    currentDate: Date
): Date[] {
    const startDay = dragStart.getDay();
    const currentDay = currentDate.getDay();
    const startTime = _calculateTimeInMinutes(dragStart);
    const currentTime = _calculateTimeInMinutes(currentDate);

    const minDay = Math.min(startDay, currentDay);
    const maxDay = Math.max(startDay, currentDay);
    const minTime = Math.min(startTime, currentTime);
    const maxTime = Math.max(startTime, currentTime);

    const selectedCells = [];
    for (let day = minDay; day <= maxDay; day++) {
        for (let time = minTime; time <= maxTime; time += 30) {
            selectedCells.push(
                _generateCellDate(dragStart, day - startDay, time)
            );
        }
    }
    return selectedCells;
}

export { getSelectedCellsFromDragging };
