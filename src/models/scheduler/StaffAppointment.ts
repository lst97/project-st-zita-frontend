class StaffAppointment {
    title: string;
    startDate: Date;
    endDate: Date;
    id: number;
    location: string;
    color: string;
    constructor(
        name: string,
        startDate: Date,
        endDate: Date,
        id: number,
        location: string,
        color: string
    ) {
        this.title = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.id = id;
        this.location = location;
        this.color = color;
    }
}

export default StaffAppointment;
