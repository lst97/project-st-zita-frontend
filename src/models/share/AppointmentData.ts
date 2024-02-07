export class AppointmentData {
    title: string;
    groupId: string;
    weekViewId: string;
    location: string;
    startDate: string;
    endDate: string;

    constructor(
        title: string,
        groupId: string,
        weekViewId: string,
        location: string,
        startDate: string,
        endDate: string
    ) {
        this.title = title;
        this.groupId = groupId;
        this.weekViewId = weekViewId;
        this.location = location;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}
