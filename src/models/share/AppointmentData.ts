export class AppointmentData {
    username: string;
    groupId: string;
    weekViewId: string;
    location: string;
    startDate: Date;
    endDate: Date;

    constructor(
        username: string,
        groupId: string,
        weekViewId: string,
        location: string,
        startDate: Date,
        endDate: Date
    ) {
        this.username = username;
        this.groupId = groupId;
        this.weekViewId = weekViewId;
        this.location = location;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}
