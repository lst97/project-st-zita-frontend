export class SelectedSchedule {
    year: number;
    week: number;
    // Sun Jan 28 2024 12:00:00 GMT+1100 (Australian Eastern Daylight Time)
    schedule: Date[];
    constructor(year: number, week: number, schedule: Date[]) {
        this.year = year;
        this.week = week;
        this.schedule = schedule;
    }
}

export type StaffScheduleMap = {
    [username: string]: SelectedSchedule;
};

export class DateDuration {
    startDate: Date;
    endDate: Date;

    constructor(startDate: Date, endDate: Date) {
        this.startDate = startDate;
        this.endDate = endDate;
    }
}
