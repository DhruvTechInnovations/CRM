import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import { CalendarDays, Clock, MapPin, Plus } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import EventModal from '../components/EventModal';
import { Colors } from '../constants/theme';
import { useCalendar } from '../context/CalendarContext';

export default function CalendarScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [modalVisible, setModalVisible] = useState(false);
    const { events, loading, getMarkedDates, refreshEvents } = useCalendar();
    const [activeEvent, setActiveEvent] = useState(null);
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    useEffect(() => {
        refreshEvents();
    }, [refreshEvents]);

    const handleSaveEvent = useCallback(() => {
        setModalVisible(false);
        setActiveEvent(null);
    }, []);

    const handleCloseModal = useCallback(() => {
        setModalVisible(false);
        setActiveEvent(null);
    }, []);

    const handleDayPress = useCallback((day) => {
        setSelectedDate(day.dateString);
    }, []);

    const handleToday = useCallback(() => {
        setSelectedDate(dayjs().format('YYYY-MM-DD'));
    }, []);

    const markedDates = useMemo(() => {
        const marked = getMarkedDates();
        return {
            ...marked,
            [selectedDate]: {
                ...(marked[selectedDate] || {}),
                selected: true,
                selectedColor: theme.tint,
            }
        };
    }, [getMarkedDates, selectedDate, theme.tint]);

    const filteredEvents = useMemo(() => {
        return events.filter(event => event.date === selectedDate);
    }, [events, selectedDate]);

    const getCategoryColor = (category) => {
        switch (category?.toLowerCase()) {
            case 'work': return '#3b82f6'; // Blue
            case 'personal': return '#10b981'; // Green
            case 'urgent': return '#ef4444'; // Red
            case 'meeting': return '#8b5cf6'; // Purple
            default: return theme.cal2; // Gray
        }
    };

    const renderEventItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.eventCard, { backgroundColor: theme.cal, borderColor: colorScheme === 'dark' ? '#334155' : '#f1f5f9' }]}
            onPress={() => {
                setActiveEvent(item);
                setModalVisible(true);
            }}
        >
            <View style={[
                styles.eventColorBar,
                { backgroundColor: getCategoryColor(item.category) }
            ]} />
            <View style={styles.eventInfo}>
                <View style={styles.eventTitleRow}>
                    <Text style={[styles.eventTitle, { color: theme.cal2 }]} numberOfLines={1}>{item.title}</Text>
                    {item.category && (
                        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) + '15' }]}>
                            <Text style={[styles.categoryText, { color: getCategoryColor(item.category) }]}>
                                {item.category}
                            </Text>
                        </View>
                    )}
                </View>
                <View style={styles.eventMeta}>
                    {!item.isAllDay && item.startTime && (
                        <View style={styles.metaItem}>
                            <Clock size={14} color={theme.cal2} />
                            <Text style={[styles.metaText, { color: theme.cal2 }]}>{item.startTime} - {item.endTime || 'No end time'}</Text>
                        </View>
                    )}
                    {item.isAllDay && (
                        <View style={styles.metaItem}>
                            <Clock size={14} color={theme.icon} />
                            <Text style={[styles.metaText, { color: theme.icon }]}>All Day</Text>
                        </View>
                    )}
                    {item.location && (
                        <View style={styles.metaItem}>
                            <MapPin size={14} color={theme.icon} />
                            <Text style={[styles.metaText, { color: theme.icon }]}>{item.location}</Text>
                        </View>
                    )}
                </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.cal2} />
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, {
                paddingTop: insets.top + 12,
                backgroundColor: theme.background,
                borderBottomColor: '#e5e5e5',
                borderBottomEndRadius:0
            }]}>
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color={theme.text} />
                    </TouchableOpacity>

                    <Text style={[styles.headerTitle, { color: theme.text }]}>Calendar</Text>

                    <TouchableOpacity onPress={handleToday} style={[styles.todayBtn, { backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#eff6ff' }]}>
                        <CalendarDays size={20} color={theme.cal} />
                    </TouchableOpacity>
                </View>
            </View>

            {loading ? (
                <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
                    <ActivityIndicator size="large" color={theme.tint} />
                    <Text style={[styles.loadingText, { color: theme.icon }]}>Fetching events...</Text>
                </View>
            ) : (
                <View style={styles.content}>
                    <Calendar
                        current={selectedDate}
                        onDayPress={handleDayPress}
                        markedDates={markedDates}
                        key={colorScheme} // Force re-render on theme change
                        theme={{
                            calendarBackground: theme.background,
                            textSectionTitleColor: theme.cal,
                            selectedDayBackgroundColor: theme.tint,
                            selectedDayTextColor: 'white',
                            todayTextColor: theme.tint,
                            dayTextColor: theme.text,
                            textDisabledColor: colorScheme === 'dark' ? '#334155' : '#d9e1e8',
                            dotColor: theme.tint,
                            selectedDotColor: '#ffffff',
                            arrowColor: theme.cal,
                            disabledArrowColor: '#d9e1e8',
                            monthTextColor: theme.text,
                            indicatorColor: theme.tint,
                            textDayFontWeight: '500',
                            textMonthFontWeight: 'bold',
                            textDayHeaderFontWeight: '500',
                            'stylesheet.calendar.header': {
                                week: {
                                    marginTop: 5,
                                    flexDirection: 'row',
                                    justifyContent: 'space-around'
                                }
                            }
                        }}
                    />

                    <View style={[styles.eventsContainer, { backgroundColor: colorScheme === 'dark' ? '#0F172A' : '#f8fafc', borderTopColor: colorScheme === 'dark' ? '#1E293B' : '#f1f5f9' }]}>
                        <View style={[styles.eventsHeader, { backgroundColor: colorScheme === 'dark' ? '#0F172A' : '#ffffff' }]}>
                            <Text style={[styles.eventsTitle, { color: theme.text }]}>
                                Events for {dayjs(selectedDate).format('MMMM D, YYYY')}
                            </Text>
                        </View>

                        <FlatList
                            data={filteredEvents}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderEventItem}
                            contentContainerStyle={styles.eventList}
                            ListEmptyComponent={() => (
                                <View style={styles.emptyContainer}>
                                    <Text style={[styles.emptyText, { color: theme.cal }]}>No events scheduled for this day</Text>
                                </View>
                            )}
                        />
                    </View>
                </View>
            )}

            <TouchableOpacity
                style={[styles.fab, { bottom: insets.bottom + 20, backgroundColor: theme.tint, shadowColor: theme.tint }]}
                onPress={() => {
                    setActiveEvent(null);
                    setModalVisible(true);
                }}
                activeOpacity={0.8}
            >
                <Plus size={28} color="#ffffff" />
            </TouchableOpacity>

            <EventModal
                visible={modalVisible}
                onClose={handleCloseModal}
                onSave={handleSaveEvent}
                selectedDate={selectedDate}
                event={activeEvent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        borderBottomWidth: 1,
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backBtn: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    todayBtn: {
        padding: 8,
        borderRadius: 8,
    },
    content: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
    },
    eventsContainer: {
        flex: 1,
        borderTopWidth: 1,
    },
    eventsHeader: {
        padding: 16,
    },
    eventsTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    eventList: {
        padding: 16,
        paddingBottom: 100,
    },
    eventCard: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
    },
    eventColorBar: {
        width: 4,
        height: '100%',
        borderRadius: 2,
        marginRight: 12,
    },
    eventInfo: {
        flex: 1,
    },
    eventTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    eventTitle: {
        fontSize: 15,
        fontWeight: '600',
        flex: 1,
        marginRight: 8,
    },
    categoryBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    categoryText: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    eventMeta: {
        flexDirection: 'column',
        gap: 4,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 12,
    },
    emptyContainer: {
        padding: 32,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
        textAlign: 'center',
    },
    fab: {
        position: 'absolute',
        right: 24,
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
        zIndex: 100,
    },
});