export const isScheduleDueToday = (schedule, today = new Date()) => {
    const formatter = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

    const todayIST = new Date(formatter.format(today));
    const startIST = new Date(formatter.format(new Date(schedule.startDate)));

    if (schedule.frequency === "daily") {
        return true;
    }

    if (schedule.frequency === "alternate") {
        const diffDays = Math.floor(
            (todayIST - startIST) / (1000 * 60 * 60 * 24)
        );

        return diffDays % 2 === 0;
    }

    if (schedule.frequency === "weekly") {
        return todayIST.getDay() === startIST.getDay();
    }

    return false;
};

export const isTimeDue = (schedule, now = new Date()) => {
    const currentTime = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(now);

    return schedule.times.includes(currentTime);
};

export const hasReminderBeenSent = (schedule, now = new Date()) => {
    if (!schedule.lastReminderSent) return false;

    const formatter = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

    return (
        formatter.format(new Date(schedule.lastReminderSent)) ===
        formatter.format(now)
    );
};