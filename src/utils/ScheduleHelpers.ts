function _calculateTimeInMinutes(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

function _generateCellDate(
  baseDate: Date,
  dayOffset: number,
  timeInMinutes: number
): string {
  const cellDate = new Date(baseDate);
  cellDate.setDate(cellDate.getDate() + dayOffset);
  cellDate.setHours(Math.floor(timeInMinutes / 60), timeInMinutes % 60);
  return cellDate.toString();
}

function getSelectedCells(dragStart: Date, currentDate: Date): string[] {
  const startDay = dragStart.getDay();
  const currentDay = currentDate.getDay();
  const startTime = _calculateTimeInMinutes(dragStart);
  const currentTime = _calculateTimeInMinutes(currentDate);

  const minDay = Math.min(startDay, currentDay);
  const maxDay = Math.max(startDay, currentDay);
  const minTime = Math.min(startTime, currentTime);
  const maxTime = Math.max(startTime, currentTime);

  const selectedCells = [];
  for (let day = minDay; day <= maxDay; day++) {
    for (let time = minTime; time <= maxTime; time += 30) {
      selectedCells.push(_generateCellDate(dragStart, day - startDay, time));
    }
  }
  return selectedCells;
}

export { getSelectedCells };
