export const isScheduleDueToday = (schedule, today = new Date()) => {

    const currentDate = new Date(today);
    currentDate.setHours(0, 0, 0, 0);

    const startDate = new Date(schedule.startDate);
    startDate.setHours(0, 0, 0, 0);

    if (schedule.frequency === "daily") {
        return true;
    }

    if (schedule.frequency === "alternate") {
        const diffDays = Math.floor(
            (currentDate - startDate) / (1000 * 60 * 60 * 24)
        );

        return diffDays % 2 === 0;
    }

    if (schedule.frequency === "weekly") {
        return currentDate.getDay() === startDate.getDay();
    }

    return false;
};

export const isTimeDue = (schedule, now = new Date()) => {

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    const currentTime = `${hours}:${minutes}`;

    return schedule.times.includes(currentTime);

};

export const hasReminderBeenSent = (schedule, now = new Date()) => {

    if (!schedule.lastReminderSent) {
        return false;
    }

    const last = new Date(schedule.lastReminderSent);

    return (
        last.getFullYear() === now.getFullYear() &&
        last.getMonth() === now.getMonth() &&
        last.getDate() === now.getDate() &&
        last.getHours() === now.getHours() &&
        last.getMinutes() === now.getMinutes()
    );
};