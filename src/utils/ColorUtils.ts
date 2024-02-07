export class ColorUtils {
    static colorMap = new Map<string, string>();

    static getColor(color: string): string {
        switch (color) {
            case 'red':
                return '#FF0000';
            case 'green':
                return '#00FF00';
            case 'blue':
                return '#0000FF';
            case 'yellow':
                return '#FFFF00';
            case 'orange':
                return '#FFA500';
            case 'purple':
                return '#800080';
            case 'pink':
                return '#FFC0CB';
            case 'brown':
                return '#A52A2A';
            case 'white':
                return '#FFFFFF';
            default:
                return '#000000';
        }
    }

    static clearColorMap(): void {
        this.colorMap.clear();
    }

    static generateRandomColor(): string {
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += Math.floor(Math.random() * 16).toString(16);
        }
        return color;
    }

    static getColorFor(staff: string): string {
        if (this.colorMap.has(staff)) {
            const color = this.colorMap.get(staff);
            if (color) {
                return color;
            }
        }

        const newColor = ColorUtils.generateRandomColor();
        this.colorMap.set(staff, newColor);

        return newColor;
    }

    static setColorFor(staff: string, color: string): void {
        this.colorMap.set(staff, color);
    }
}
