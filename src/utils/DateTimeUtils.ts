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
