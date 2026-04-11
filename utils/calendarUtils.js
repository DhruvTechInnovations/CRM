
import dayjs from 'dayjs';
export const generateId = () => {
    return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
};

export const normalizeFromLead = (lead, data) => {
    console.log("[calendarUtils] normalizeFromLead started", { leadId: lead?.id, data });
    const { selectedDate, eventTitle } = data;

    if (!selectedDate) {
        console.error("[calendarUtils] selectedDate is missing!");
        throw new Error("selectedDate is missing in normalization");
    }

    const dateStr = dayjs(selectedDate).format('YYYY-MM-DD');
    console.log("[calendarUtils] dateStr:", dateStr);

    const start = new Date(selectedDate);
    const end = new Date(selectedDate.getTime() + 60 * 60 * 1000);

    return {
        id: generateId(),
        title: eventTitle || `Follow-up with ${lead?.name}`,
        date: dateStr,
        start,
        end,
        startTime: start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        endTime: end.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        isAllDay: false,
        source: 'lead',
        leadId: lead?.id,
        leadName: lead?.name,
        createdAt: new Date().toISOString(),
    };
};

export const normalizeFromCalendar = (data, existingId = null) => {
    const { title, date, startTime, endTime, isAllDay } = data;

    const [year, month, day] = date.split('-').map(Number);

    let start, end;

    if (isAllDay) {
        start = new Date(year, month - 1, day, 0, 0, 0);
        end = new Date(year, month - 1, day, 23, 59, 59);
    } else {

        const parseTime = (timeStr) => {
            if (!timeStr) return { hours: 10, minutes: 0 };

            try {
                const cleanStr = timeStr.replace(/\u00a0/g, ' ').toUpperCase().trim();
                let standardizedStr = cleanStr;
                if (!cleanStr.includes(' ') && (cleanStr.endsWith('AM') || cleanStr.endsWith('PM'))) {
                    standardizedStr = cleanStr.slice(0, -2) + ' ' + cleanStr.slice(-2);
                }

                const parts = standardizedStr.split(' ');
                const timePart = parts[0];
                const modifier = parts.length > 1 ? parts[1] : null;

                let [hours, minutes] = timePart.split(':').map(Number);
                if (isNaN(hours)) hours = 10;
                if (isNaN(minutes)) minutes = 0;

                if (modifier === 'PM' && hours < 12) hours += 12;
                else if (modifier === 'AM' && hours === 12) hours = 0;

                return { hours, minutes };
            } catch (e) {
                return { hours: 10, minutes: 0 };
            }
        };

        const startT = parseTime(startTime);
        const endT = parseTime(endTime);

        start = new Date(year, month - 1, day, startT.hours, startT.minutes);
        end = new Date(year, month - 1, day, endT.hours, endT.minutes);
    }

    return {
        id: existingId || generateId(),
        title: title,
        date: date,
        start,
        end,
        startTime: isAllDay ? null : startTime,
        endTime: isAllDay ? null : endTime,
        isAllDay,
        source: 'calendar',
        createdAt: new Date().toISOString(),
    };
};


export const validateEvent = (event) => {
    const errors = [];

    if (!event.id) errors.push("Missing ID");
    if (!event.title || event.title.trim() === "") errors.push("Missing Title");
    if (!event.date || !/^\d{4}-\d{2}-\d{2}$/.test(event.date)) {
        errors.push("Invalid or missing date format (YYYY-MM-DD)");
    }
    if (!['lead', 'calendar'].includes(event.source)) {
        errors.push("Invalid source type");
    }
    if (!event.createdAt || isNaN(Date.parse(event.createdAt))) {
        errors.push("Invalid or missing createdAt timestamp");
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};
