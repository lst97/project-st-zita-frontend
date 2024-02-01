export function getISOWeekNumberFromDate(date: Date): number {
    // Create a new date object for the target date
    const target = new Date(date.valueOf());

    // Set the target to the nearest Thursday
    const dayNr = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);

    // Calculate the first Thursday of the year
    const firstDayOfYear = new Date(target.getFullYear(), 0, 1);
    const firstThursday = new Date(firstDayOfYear);
    firstThursday.setDate(
        firstDayOfYear.getDate() + ((4 - firstDayOfYear.getDay() + 7) % 7)
    );

    // Calculate the number of days between the first Thursday and the target date
    const weekDiff =
        (target.valueOf() - firstThursday.valueOf()) /
        (1000 * 60 * 60 * 24 * 7);

    // Return the week number
    return 1 + Math.floor(weekDiff);
}

export function getISOWeekNumberFromDateString(dateString: string): number {
    let date;

    if (dateString.includes('-')) {
        // Extract the start date from a range
        const startDateString = dateString.split('-')[0].trim();
        date = parseDate(startDateString);
    } else {
        // Handle a single date string
        date = parseDate(dateString);
    }

    return getISOWeekNumberFromDate(date);
}

function parseDate(dateStr: string): Date {
    // Assuming the format is 'dd/mm/yyyy'
    const parts = dateStr.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // months are 0-based in JavaScript
    const year = parseInt(parts[2], 10);

    return new Date(year, month, day);
}

// "Sun Jan 28 2024 12:00:00 GMT+1100 (Australian Eastern Daylight Time)" -> '2024-01-28T09:00'
export function convertScheduleStringToAppointmentDateString(
    scheduleString: string
): string {
    // Parse the string into a Date object
    const date = new Date(scheduleString);

    // Format the Date
    return date.toISOString().slice(0, 16).replace('T', ' ');
}

export function convertDateToScheduleString(date: Date): string {
    return date.toISOString();
}

export function formatDateNavigatorText(date: Date, viewName: string) {
    const formatDate = (date: Date) => date.toLocaleDateString(); // Customize this as needed

    switch (viewName) {
        case 'Day':
            return formatDate(date);
        case 'Week': {
            let startOfWeek = new Date(date);
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Adjust if your week starts on a different day
            let endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(endOfWeek.getDate() + 6);
            return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
        }
        case 'Month':
            return date.toLocaleDateString(undefined, {
                month: 'long',
                year: 'numeric'
            });
        default:
            return formatDate(date);
    }
}
