class StaffCardContent {
    name: string;
    description: string;
    color: string;
    image?: string;
    phoneNumber?: string;
    constructor(
        name: string,
        description: string,
        color: string,
        image?: string,
        phoneNumber?: string
    ) {
        this.name = name;
        this.description = description;
        this.color = color;
        if (image) {
            this.image = image;
        }
        if (phoneNumber) {
            this.phoneNumber = phoneNumber;
        }
    }
}

export default StaffCardContent;
