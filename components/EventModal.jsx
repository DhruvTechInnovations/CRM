import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar as CalendarIcon, Clock, Trash2, Type, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { useColorScheme } from 'react-native';
import { Colors } from '../constants/theme';
import { useCalendar } from '../context/CalendarContext';
import { useNotification } from '../context/NotificationContext';
import * as calendarUtils from '../utils/calendarUtils';

const EventModal = ({ visible, onClose, onSave, selectedDate, event }) => {
    const [title, setTitle] = useState('');
    const [isAllDay, setIsAllDay] = useState(false);
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date(new Date().getTime() + 60 * 60 * 1000));
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const { addEvent, updateEvent, deleteEvent } = useCalendar();
    const { showNotification } = useNotification();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    useEffect(() => {
        if (event) {
            setTitle(event.title || '');
            setIsAllDay(!!event.isAllDay);
            setStartTime(event.start instanceof Date ? event.start : new Date(event.start));
            setEndTime(event.end instanceof Date ? event.end : new Date(event.end));
        } else if (visible) {
            // Only clear fields when modal becomes visible for a NEW event
            clearFields();
        }
    }, [event, visible]);

    const handleSave = async () => {
        if (!title.trim()) {
            alert('Please enter an event title');
            return;
        }

        const normalizedEvent = calendarUtils.normalizeFromCalendar({
            title,
            isAllDay,
            date: selectedDate,
            startTime: isAllDay ? null : startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
            endTime: isAllDay ? null : endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        }, event?.id);

        let success;
        if (event && event.id) {
            success = await updateEvent(event.id, normalizedEvent);
        } else {
            success = await addEvent(normalizedEvent);
        }

        if (success) {
            showNotification(event ? "Event updated successfully" : "Event saved successfully", "success");
            if (onSave) onSave(normalizedEvent);
            handleCancel();
        } else {
            showNotification(event ? "Failed to update event" : "Failed to save event", "error");
        }
    };

    const handleDelete = async () => {
        if (!event || !event.id) return;
        console.log("Deleting event:", event.id);

        const success = await deleteEvent(event.id);
        if (success) {
            showNotification("Event deleted successfully", "success");
            handleCancel();
        } else {
            showNotification("Failed to delete event", "error");
        }
    };

    const clearFields = () => {
        setTitle('');
        setIsAllDay(false);
        setStartTime(new Date());
        setEndTime(new Date(new Date().getTime() + 60 * 60 * 1000));
    };

    const handleCancel = () => {
        clearFields();
        onClose();
    };

    const onChangeStart = (event, selectedDate) => {
        setShowStartPicker(Platform.OS === 'ios');
        if (selectedDate) {
            setStartTime(selectedDate);
            // Ensure end time is at least 1 hour after start time
            if (endTime <= selectedDate) {
                setEndTime(new Date(selectedDate.getTime() + 60 * 60 * 1000));
            }
        }
    };

    const onChangeEnd = (event, selectedDate) => {
        setShowEndPicker(Platform.OS === 'ios');
        if (selectedDate) {
            setEndTime(selectedDate);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={handleCancel}
        >
            <View style={styles.overlay}>
                <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
                    <View style={[styles.header, { borderBottomColor: colorScheme === 'dark' ? '#334155' : '#f3f4f6' }]}>
                        <Text style={[styles.headerTitle, { color: theme.text }]}>{event ? 'Event Details' : 'Add New Event'}</Text>
                        <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
                            <X size={24} color={theme.cal} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
                        <View style={styles.inputContainer}>
                            <View style={styles.inputLabelRow}>
                                <Type size={18} color={theme.icon} style={styles.inputIcon} />
                                <Text style={[styles.inputLabel, { color: theme.text }]}>Event Title</Text>
                            </View>
                            <TextInput
                                style={[
                                    styles.textInput,
                                    {
                                        backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#f9fafb',
                                        borderColor: colorScheme === 'dark' ? '#334155' : '#e5e7eb',
                                        color: theme.text
                                    }
                                ]}
                                placeholder="What's happening?"
                                placeholderTextColor={theme.cal}
                                value={title}
                                onChangeText={setTitle}
                            />
                        </View>

                        <View style={[styles.dateInfoRow, { backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#eff6ff' }]}>
                            <CalendarIcon size={18} color={theme.cal} style={styles.inputIcon} />
                            <Text style={[styles.dateText, { color: theme.cal }]}>Date: {selectedDate}</Text>
                        </View>

                        <View style={styles.toggleRow}>
                            <View style={styles.toggleLabelRow}>
                                <Clock size={18} color={theme.icon} style={styles.inputIcon} />
                                <Text style={[styles.inputLabel, { color: theme.text }]}>All Day Event</Text>
                            </View>
                            <Switch
                                value={isAllDay}
                                onValueChange={setIsAllDay}
                                trackColor={{ false: colorScheme === 'dark' ? '#334155' : "#d1d5db", true: theme.tint }}
                                thumbColor={Platform.OS === 'ios' ? '#fff' : (colorScheme === 'dark' ? '#94A3B8' : '#f9fafb')}
                            />
                        </View>

                        {!isAllDay && (
                            <View style={styles.timeContainer}>
                                <View style={styles.timePickerRow}>
                                    <View style={styles.timePickerBox}>
                                        <Text style={[styles.timeLabel, { color: theme.cal }]}>Start Time</Text>
                                        <TouchableOpacity
                                            style={[
                                                styles.timeButton,
                                                {
                                                    backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#f9fafb',
                                                    borderColor: colorScheme === 'dark' ? '#334155' : '#e5e7eb'
                                                }
                                            ]}
                                            onPress={() => setShowStartPicker(true)}
                                        >
                                            <Text style={[styles.timeButtonText, { color: theme.text }]}>
                                                {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.timePickerBox}>
                                        <Text style={[styles.timeLabel, { color: theme.cal }]}>End Time</Text>
                                        <TouchableOpacity
                                            style={[
                                                styles.timeButton,
                                                {
                                                    backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#f9fafb',
                                                    borderColor: colorScheme === 'dark' ? '#334155' : '#e5e7eb'
                                                }
                                            ]}
                                            onPress={() => setShowEndPicker(true)}
                                        >
                                            <Text style={[styles.timeButtonText, { color: theme.text }]}>
                                                {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {showStartPicker && (
                                    <DateTimePicker
                                        value={startTime}
                                        mode="time"
                                        is24Hour={false}
                                        display="spinner"
                                        onChange={onChangeStart}
                                        themeVariant={colorScheme ?? 'light'}
                                    />
                                )}

                                {showEndPicker && (
                                    <DateTimePicker
                                        value={endTime}
                                        mode="time"
                                        is24Hour={false}
                                        display="spinner"
                                        onChange={onChangeEnd}
                                        themeVariant={colorScheme ?? 'light'}
                                    />
                                )}
                            </View>
                        )}
                    </ScrollView>

                    <View style={[styles.footer, { borderTopColor: colorScheme === 'dark' ? '#334155' : '#f3f4f6' }]}>
                        <TouchableOpacity
                            style={[styles.button, styles.saveButton, { backgroundColor: theme.cal }]}
                            onPress={handleSave}
                        >
                            <Text style={[styles.saveButtonText, { color: theme.cal2 }]}>{event ? 'Update Event' : 'Save Event'}</Text>
                        </TouchableOpacity>
                        {event && (
                            <TouchableOpacity
                                style={[styles.button, styles.deleteButton, { backgroundColor: colorScheme === 'dark' ? '#7f1d1d' : '#fee2e2' }]} // Darker red bg for dark mode
                                onPress={handleDelete}
                            >
                                <Trash2 size={20} color="#ef4444" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
        maxHeight: '80%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    closeButton: {
        padding: 4,
    },
    body: {
        padding: 24,
    },
    inputContainer: {
        marginBottom: 24,
    },
    inputLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    inputIcon: {
        marginRight: 8,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
    },
    textInput: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
    },
    dateInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        padding: 12,
        borderRadius: 8,
    },
    dateText: {
        fontSize: 16,
        fontWeight: '500',
    },
    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    toggleLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeContainer: {
        marginBottom: 24,
    },
    timePickerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
    },
    timePickerBox: {
        flex: 1,
    },
    timeLabel: {
        fontSize: 12,
        marginBottom: 8,
        fontWeight: '500',
    },
    timeButton: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
    },
    timeButtonText: {
        fontSize: 16,
        fontWeight: '500',
    },
    footer: {
        flexDirection: 'row',
        padding: 24,
        gap: 12,
        borderTopWidth: 1,
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: '#f3f4f6',
    },
    cancelButtonText: {
        color: '#4b5563',
        fontSize: 16,
        fontWeight: '600',
    },
    saveButton: {
        // backgroundColor: set dynamically
    },
    saveButtonText: {
        color: '',
        fontSize: 16,
        fontWeight: '600',
    },
    deleteButton: {
        flex: 0,
        paddingHorizontal: 16,
    },
});

export default EventModal;
