class StaffAppointment {
    title: string;
    startDate: Date;
    endDate: Date;
    id: number;
    location: string;
    color: string;
    opacity: number;
    constructor(
        name: string,
        startDate: Date,
        endDate: Date,
        id: number,
        location: string,
        color: string,
        opacity?: number
    ) {
        this.title = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.id = id;
        this.location = location;
        this.color = color;
        this.opacity = opacity ?? 1;
    }
}

export default StaffAppointment;
