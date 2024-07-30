export const getDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const duration = endDate.getTime() - startDate.getTime();
    return duration;
}

export const getDurationString = (start: string, end: string) => {
    const duration = Math.floor(getDuration(start, end) / 1000);

    if (duration < 60) {
        return `${duration} sec`;
    } else if (duration < 3600) {
        return `${Math.floor(duration / 60)} min`;
    } else {
        return `${Math.floor(duration / 3600)} h`;
    }
}