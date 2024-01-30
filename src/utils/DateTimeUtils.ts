import { DateDuration } from '../models/scheduler/ScheduleModel';

// 'Jan 28 - Feb 3, 2024' or 'Feb 3, 2024'
export function getISOWeekNumber(dateString: string) {
    let date = null;
    if (dateString.includes('-')) {
        date = dateStringDurationToDateDuration(dateString).startDate;
    } else {
        const year = dateString.slice(-4);
        date = new Date(`${dateString}, ${year}`);
    }

    // Create a new date object for the target date
    const target = new Date(date.valueOf());

    // Set the target to the nearest Thursday (current date + 3 - current day number)
    // This ensures we're always calculating from a week starting on a Monday
    const dayNr = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);

    // Calculate the first Thursday of the year
    const firstThursday = new Date(target.getFullYear(), 0, 1);
    if (firstThursday.getDay() !== 4) {
        firstThursday.setMonth(0, 1 + ((4 - firstThursday.getDay() + 7) % 7));
    }

    // Calculate the number of weeks between the first Thursday and the target date
    const weekNumber =
        1 + Math.ceil((target.getTime() - firstThursday.getTime()) / 604800000); // 604800000 = number of milliseconds in a week

    return weekNumber;
}

// 'Jan 28 - Feb 3, 2024';
function dateStringDurationToDateDuration(dateString: string) {
    // Step 1: Split the string into two parts
    const [startStr, endStr] = dateString.split(' - ');

    // Step 2: Add the year to each part and parse them into Date objects
    const year = dateString.slice(-4); // Extracting the year (last 4 characters)
    const startDate = new Date(`${startStr}, ${year}`);
    const endDate = new Date(`${endStr}, ${year}`);
    return new DateDuration(startDate, endDate);
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
