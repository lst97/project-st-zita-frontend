import StaffAppointment from '../models/scheduler/StaffAppointment';
import { ColorUtils } from './ColorUtils';

function _calculateTimeInMinutes(date: Date): number {
    return date.getHours() * 60 + date.getMinutes();
}

const APPOINTMENT_LENGTH = 30; // Each time-slot is 30 minutes

export function parseAndSortDate(dateStrings: string[]) {
    const dates = dateStrings.map((dateStr) => new Date(dateStr));
    dates.sort((a, b) => a.getTime() - b.getTime());
    return dates;
}

export function groupContinuesTime(dates: Date[]): Date[][] {
    const groupedDates = [];
    let tempGroup = [dates[0]];

    for (let i = 1; i < dates.length; i++) {
        const diff =
            (dates[i].getTime() - tempGroup[tempGroup.length - 1].getTime()) /
            1000 /
            60; // Difference in minutes

        if (diff <= APPOINTMENT_LENGTH) {
            tempGroup.push(dates[i]);
        } else {
            groupedDates.push(tempGroup);
            tempGroup = [dates[i]];
        }
    }

    if (tempGroup.length > 0) {
        groupedDates.push(tempGroup);
    }

    return groupedDates;
}

export function dateGroupToAppointments(
    staffName: string,
    dateGroup: Date[][]
): StaffAppointment[] {
    const appointments = dateGroup.map((group: Date[], index: number) => {
        const startDate = group[0];
        const endDate = new Date(
            group[group.length - 1].getTime() + APPOINTMENT_LENGTH * 60000
        );
        return new StaffAppointment(
            staffName,
            startDate,
            endDate,
            index,
            '',
            ColorUtils.getColorFor(staffName)
        );
    });

    return appointments;
}
function _generateCellDate(
    baseDate: Date,
    dayOffset: number,
    timeInMinutes: number
): string {
    const cellDate = new Date(baseDate);
    cellDate.setDate(cellDate.getDate() + dayOffset);
    cellDate.setHours(Math.floor(timeInMinutes / 60), timeInMinutes % 60);
    return cellDate.toString();
}

function getSelectedCells(dragStart: Date, currentDate: Date): string[] {
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

export { getSelectedCells };
