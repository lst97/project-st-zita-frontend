import { ColorUtils } from '../../utils/ColorUtils';

interface StaffCardContentParams {
    name: string;
    totalHours?: string;
    description?: string;
    color?: string;
    image?: string;
    phoneNumber?: string;
}

class StaffCardContent {
    name: string;
    totalHours?: string;
    description?: string;
    color?: string;
    image?: string;
    phoneNumber?: string;

    constructor({
        name,
        totalHours,
        description,
        color = ColorUtils.generateRandomColor(),
        image,
        phoneNumber
    }: StaffCardContentParams) {
        this.name = name;
        this.totalHours = totalHours;
        this.description = description;
        this.color = color;
        this.image = image;
        this.phoneNumber = phoneNumber;
    }
}

export default StaffCardContent;
