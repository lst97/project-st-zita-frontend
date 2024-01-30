class StaffSchedule {
    name: string;
    startDate: Date;
    endDate: Date;
    id: number;
    location: string;
    constructor(
        name: string,
        startDate: Date,
        endDate: Date,
        id: number,
        location: string
    ) {
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.id = id;
        this.location = location;
    }
}

export default StaffSchedule;
