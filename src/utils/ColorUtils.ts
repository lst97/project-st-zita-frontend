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
            case 'black':
                return '#000000';
            case 'white':
                return '#FFFFFF';
            default:
                return '#000000';
        }
    }

    private static generateRandomColor(): string {
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += Math.floor(Math.random() * 16).toString(16);
        }
        return color;
    }

    static generateUserColors(users: string[]): void {
        users.forEach((user) => {
            this.colorMap.set(user, this.generateRandomColor());
        });
    }

    static getColorFor(user: string): string {
        if (this.colorMap.has(user)) {
            const color = this.colorMap.get(user);
            if (color) {
                return color;
            }
        }

        const newColor = this.generateRandomColor();
        this.colorMap.set(user, newColor);

        return newColor;
    }
}
