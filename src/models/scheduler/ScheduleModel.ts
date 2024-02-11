export class SelectedSchedule {
    year: number;
    week: number;
    schedule: Date[];
    constructor(year: number, week: number, schedule: Date[]) {
        this.year = year;
        this.week = week;
        this.schedule = schedule;
    }
}

export type StaffScheduleMap = {
    [staffName: string]: SelectedSchedule;
};

export class DateDuration {
    startDate: Date;
    endDate: Date;

    constructor(startDate: Date, endDate: Date) {
        this.startDate = startDate;
        this.endDate = endDate;
    }
}
