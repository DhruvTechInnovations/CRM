import dayjs from 'dayjs';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { calendarService } from '../services/apiService';
import { validateEvent } from '../utils/calendarUtils';

const CalendarContext = createContext(null);

export const useCalendar = () => {
    const context = useContext(CalendarContext);
    if (!context) {
        throw new Error('useCalendar must be used inside CalendarProvider');
    }
    return context;
};

export const CalendarProvider = ({ children }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const transformEvents = useCallback((apiEvents) => {
        if (!apiEvents || !Array.isArray(apiEvents)) return [];

        return apiEvents.map(item => {
            // Support both {id, data: {...}} and {...flatItem}
            const eventData = item.data || item || {};
            const id = item.id || item._id || item.insertedId || `temp-${Date.now()}`;

            const startDate = eventData.start ? new Date(eventData.start) : new Date();
            const endDate = eventData.end ? new Date(eventData.end) : null;

            const dateStr = dayjs(startDate).format('YYYY-MM-DD');

            return {
                ...eventData,
                id: id,
                originalId: id,
                start: startDate,
                end: endDate || (eventData.allDay ? startDate : new Date(startDate.getTime() + 60 * 60 * 1000)),
                date: dateStr,
                // UI compatibility mapping
                isAllDay: !!eventData.allDay,
                startTime: eventData.allDay ? null : dayjs(startDate).format('hh:mm A'),
                endTime: (eventData.allDay || !endDate) ? null : dayjs(endDate).format('hh:mm A'),
                location: eventData.location || eventData.category || '', // Fallback for location/category
            };
        });
    }, []);

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        try {
            const response = await calendarService.getAll();
            const eventList = Array.isArray(response) ? response : (response?.data || []);
            setEvents(transformEvents(eventList));
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [transformEvents]);


    const addEvent = useCallback(async (normalizedEvent) => {
        const { isValid, errors } = validateEvent(normalizedEvent);

        if (!isValid) {
            console.error('[CalendarContext] Event validation failed:', errors);
            return false;
        }

        try {
            const response = await calendarService.create(normalizedEvent);
            const eventData = response.data || response;
            const eventId = eventData.id || eventData._id || eventData.insertedId;

            if (response.success || eventId) {
                // If it's a completely different structure or missing data, we fall back to normalizedEvent 
                // but use the ACTUAL ID from the server
                const transformed = transformEvents([eventData])[0] || {
                    ...normalizedEvent,
                    id: eventId,
                    originalId: eventId
                };

                setEvents(prev => [...prev, transformed]);
                return true;
            }
            return false;
        } catch (err) {
            console.error('[CalendarContext] Error adding event:', err);
            return false;
        }
    }, [transformEvents]);

    const updateEvent = useCallback(async (eventId, updatedEvent) => {
        const { isValid, errors } = validateEvent(updatedEvent);

        if (!isValid) {
            console.error('[CalendarContext] Event validation failed:', errors);
            return false;
        }

        try {
            const response = await calendarService.update(eventId, updatedEvent);
            const eventData = response.data || response;

            if (response.success || !response.error) {
                // After successful update, we want to reflect the LATEST data in the state.
                // If the server returns the updated object, use it. 
                // Otherwise fall back to the updatedEvent we sent.
                const transformed = transformEvents([eventData])[0] || {
                    ...updatedEvent,
                    id: eventId,
                    originalId: eventId
                };

                setEvents(prev => prev.map(evt => evt.id === eventId ? transformed : evt));
                return true;
            }
            return false;
        } catch (err) {
            console.error('[CalendarContext] Error updating event:', err);
            return false;
        }
    }, [transformEvents]);


    const deleteEvent = useCallback(async (eventId) => {
        try {
            const response = await calendarService.delete(eventId);
            if (response.success || response.message?.includes('deleted') || response.status === 200) {
                setEvents(prev => prev.filter(event => event.id !== eventId));
                return true;
            }
            if (!response.error) {
                setEvents(prev => prev.filter(event => event.id !== eventId));
                return true;
            }
            return false;
        } catch (err) { console.log(err) }
    }, []);

    const hasEvents = useCallback((date) => {
        return events.some(event => event.date === date);
    }, [events]);

    const getMarkedDates = useCallback(() => {
        const marked = {};
        events.forEach(event => {
            if (!marked[event.date]) {
                marked[event.date] = {
                    marked: true,
                    dotColor: '#3b82f6',
                };
            }
        });
        return marked;
    }, [events]);

    const contextValue = useMemo(() => ({
        events,
        loading,
        error,
        addEvent,
        updateEvent,
        deleteEvent,
        hasEvents,
        getMarkedDates,
        refreshEvents: fetchEvents
    }), [events, loading, error, addEvent, deleteEvent, hasEvents, getMarkedDates, fetchEvents]);

    return (
        <CalendarContext.Provider value={contextValue}>
            {children}
        </CalendarContext.Provider>
    );
};

export default CalendarContext;
