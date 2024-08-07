export const getDuration = (startDate: Date, endDate: Date) => {
    const duration = endDate.getTime() - startDate.getTime();
    return duration;
}

export const getDurationString = (workflow: any, refreshedAt: Date) => {
    const { startedAt, finishedAt, stoppedAt } = workflow;

    const endTimeStatusMapping: { [key: string]: any } = {
        failed: finishedAt,
        finished: finishedAt,
        stopped: stoppedAt,
        deleted: finishedAt || stoppedAt,
    }

    if (startedAt) {
        const dateTermination = '.000Z';
        const start = new Date(startedAt + dateTermination);
        const end = endTimeStatusMapping[workflow.status] ? new Date(endTimeStatusMapping[workflow.status] + dateTermination) : refreshedAt;

        const duration = Math.floor(getDuration(start, end) / 1000);

        if (duration < 60) {
            return `${duration} second${duration !== 1 ? 's' : ''}`;
        } else if (duration < 3600) {
            const minutes = Math.floor(duration / 60);
            return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
        } else {
            const hours = Math.floor(duration / 3600);
            return `${hours} hour${hours !== 1 ? 's' : ''}`;
        }
    }

    return '';
}