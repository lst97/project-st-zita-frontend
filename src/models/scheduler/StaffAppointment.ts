class StaffAppointment {
    title: string;
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
        this.title = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.id = id;
        this.location = location;
    }
}

export default StaffAppointment;
