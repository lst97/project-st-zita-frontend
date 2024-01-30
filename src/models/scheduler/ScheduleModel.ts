import StaffCardContent from './StaffCardContent';

export class SelectedSchedule {
    year: number;
    week: number;
    // Sun Jan 28 2024 12:00:00 GMT+1100 (Australian Eastern Daylight Time)
    schedule: string[];
    constructor(year: number, week: number, schedule: string[]) {
        this.year = year;
        this.week = week;
        this.schedule = schedule;
    }
}

export type StaffScheduleMap = {
    [username: string]: SelectedSchedule;
};
interface StaffAssignmentLists {
    assigned: StaffCardContent[];
    notAssigned: StaffCardContent[];
    staffScheduleMap: StaffScheduleMap;
}

export type StaffCardContentMap = {
    [key: string]: StaffAssignmentLists;
};
export class DateDuration {
    startDate: Date;
    endDate: Date;

    constructor(startDate: Date, endDate: Date) {
        this.startDate = startDate;
        this.endDate = endDate;
    }
}
