class StaffCardContent {
    name: string;
    description: string;
    color: string;
    image?: string;
    constructor(
        name: string,
        description: string,
        color: string,
        image?: string
    ) {
        this.name = name;
        this.description = description;
        this.color = color;
        if (image) {
            this.image = image;
        }
    }
}

export default StaffCardContent;
