export class StaffData {
    staffName: string;
    email: string;
    image?: string;
    color: string;
    phoneNumber?: string;
    id?: string;

    constructor(
        staffName: string,
        email: string,
        color: string,
        image?: string,
        phoneNumber?: string,
        id?: string
    ) {
        this.staffName = staffName;
        this.email = email;
        this.color = color;
        if (image) {
            this.image = image;
        }
        if (phoneNumber) {
            this.phoneNumber = phoneNumber;
        }
        if (id) {
            this.id = id;
        }
    }
}
