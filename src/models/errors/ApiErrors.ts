export class InvalidAppointmentShareLinkId extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidAppointmentShareLinkId';
    }
}
