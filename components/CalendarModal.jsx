import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import { useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useCalendar } from '../context/CalendarContext';
import { useNotification } from '../context/NotificationContext';
import * as calendarUtils from '../utils/calendarUtils';

// Utility Functions
const getTomorrowAt10AM = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);
  return tomorrow;
};

const formatDateTime = (date) => {
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

const getReminderMinutes = (reminderType) => {
  switch (reminderType) {
    case '1_day_before': return 1440;
    case '1_hour_before': return 60;
    case 'at_time': return 0;
    default: return 1440;
  }
};

const showToast = (message) => {
  Alert.alert('Success', message);
};

const CalendarModal = ({ visible, onClose, lead }) => {
  const [selectedDate, setSelectedDate] = useState(getTomorrowAt10AM());
  const [eventTitle, setEventTitle] = useState(`Follow-up with ${lead?.name || ''}`);
  const [reminder, setReminder] = useState('1_day_before');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const { addEvent, hasEvents } = useCalendar();
  const { showNotification } = useNotification();

  // Handle date change
  const onDateChange = (event, date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
    }
  };

  // Handle time change
  const onTimeChange = (event, date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
    }
  };

  // Quick date selection
  const setQuickDate = (days) => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + days);
    newDate.setHours(10, 0, 0, 0);
    setSelectedDate(newDate);
  };


  // Handle Add to App Calendar
  const handleAddToAppCalendar = async () => {
    console.log("handleAddToAppCalendar clicked");
    const dateStr = dayjs(selectedDate).format('YYYY-MM-DD');
    console.log("calendar modal dateStr", dateStr);

    // Conflict Detection
    if (hasEvents(dateStr)) {
      Alert.alert(
        'Conflict Detected',
        `You already have events scheduled for ${dateStr}. Do you still want to add this event?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Add Anyway',
            onPress: () => processAddToAppCalendar()
          }
        ]
      );
    } else {
      processAddToAppCalendar();
    }
  };

  const processAddToAppCalendar = async () => {
    console.log("processAddToAppCalendar started");
    console.log("Lead data in modal:", lead?.id, lead?.name);
    console.log("Selected Date in modal:", selectedDate);

    try {
      const normalizedEvent = calendarUtils.normalizeFromLead(lead, {
        selectedDate,
        eventTitle
      });

      console.log("normalizedEvent successfully created:", normalizedEvent);

      if (typeof addEvent !== 'function') {
        console.error("addEvent is not a function! It is:", typeof addEvent);
        return;
      }

      console.log("Calling addEvent...");
      const success = await addEvent(normalizedEvent);
      console.log("addEvent result:", success);
      if (success) {
        showNotification("Added to app calendar", "success");
        onClose();
      } else {
        showNotification("Failed to add to app calendar", "error");
      }
    } catch (error) {
      console.error("Error in processAddToAppCalendar:", error);
      showNotification("An error occurred", "error");
    }
  };

  if (!lead) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Schedule Event</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContentContainer}>
            {/* Lead Info Card */}
            <View style={styles.leadInfoCard}>
              <View style={styles.leadInfoRow}>
                <Text style={styles.leadInfoIcon}>👤</Text>
                <Text style={styles.leadInfoText}>Lead: {lead?.name}</Text>
              </View>
              <View style={styles.leadInfoRow}>
                <Text style={styles.leadInfoIcon}>⚖️</Text>
                <Text style={styles.leadInfoText}>{lead?.caseType} - {lead?.court}</Text>
              </View>
              <View style={styles.leadInfoRow}>
                <Text style={styles.leadInfoIcon}>📍</Text>
                <Text style={styles.leadInfoText}>{lead?.location}</Text>
              </View>
              {/* <Text style={styles.leadAssignedDate}>
                Lead assigned: {lead?.date}
              </Text> */}
            </View>

            {/* Quick Date Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Quick Select:</Text>
              <View style={styles.quickDateButtons}>
                <TouchableOpacity
                  style={styles.quickDateButton}
                  onPress={() => setQuickDate(1)}
                >
                  <Text style={styles.quickDateButtonText}>Tomorrow</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickDateButton}
                  onPress={() => setQuickDate(3)}
                >
                  <Text style={styles.quickDateButtonText}>+3 Days</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickDateButton}
                  onPress={() => setQuickDate(7)}
                >
                  <Text style={styles.quickDateButtonText}>Next Week</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Date & Time Picker */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>📅 Select Date & Time:</Text>

              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateTimeButtonText}>
                  📅 {selectedDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={styles.dateTimeButtonText}>
                  🕐 {selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onDateChange}
                  minimumDate={new Date()}
                />
              )}

              {showTimePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onTimeChange}
                />
              )}

              <View style={styles.selectedDateDisplay}>
                <Text style={styles.selectedDateText}>
                  📅 {formatDateTime(selectedDate)}
                </Text>
              </View>
            </View>

            {/* Event Title Input */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>📝 Event Title:</Text>
              <TextInput
                style={styles.textInput}
                value={eventTitle}
                onChangeText={setEventTitle}
                placeholder="e.g., Follow-up call with client"
                placeholderTextColor="#999"
              />
            </View>
            {/* Action Buttons */}
            <View style={styles.actionButtons}>

              <TouchableOpacity
                style={[styles.button, styles.appCalendarButton]}
                onPress={handleAddToAppCalendar}
              >
                <Text style={styles.buttonText}>📋 Add to App Calendar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onClose}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

// Styles
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#6b7280',
  },
  scrollContent: {
    padding: 20,
  },
  scrollContentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  leadInfoCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  leadInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  leadInfoIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  leadInfoText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  leadAssignedDate: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  quickDateButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  quickDateButton: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  quickDateButtonText: {
    color: '#1e40af',
    fontSize: 14,
    fontWeight: '500',
  },
  dateTimeButton: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  dateTimeButtonText: {
    fontSize: 14,
    color: '#374151',
  },
  selectedDateDisplay: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  selectedDateText: {
    fontSize: 14,
    color: '#6b7280',
  },
  textInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#374151',
  },
  reminderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3b82f6',
  },
  reminderOptionText: {
    fontSize: 14,
    color: '#374151',
  },
  actionButtons: {
    marginTop: 10,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  phoneCalendarButton: {
    backgroundColor: '#3b82f6',
  },
  appCalendarButton: {
    backgroundColor: '#10b981',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    padding: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default CalendarModal;