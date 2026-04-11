import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    ClipboardList,
    Phone,
    Send
} from 'lucide-react-native';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { leadService } from '@/services/apiService';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import CalendarModal from '../components/CalendarModal';
import { Colors } from '../constants/theme';
import { useLeads } from '../context/LeadContext';
import formatActivityTime from '../utils/timeUtils';

// --- Types & Helpers ---

const maskPhoneNumber = (phone: string) => {
    if (!phone || phone.length < 10) return phone;
    const visibleStart = 3;
    const visibleEnd = 4;
    const maskedLength = phone.length - visibleStart - visibleEnd;
    return `${phone.slice(0, visibleStart)}${'*'.repeat(maskedLength)}${phone.slice(-visibleEnd)}`;
};

const getStatusColor = (status: any, theme: any) => {
    switch (status) {
        case 'In Progress': return { bg: '#6366f1', text: '#fff' }; // Modern Indigo
        case "Declined": return { bg: '#ef4444', text: '#fff' };    // Modern Red
        case 'Completed': return { bg: '#22c55e', text: '#fff' };   // Modern Green
        default: return { bg: theme.icon, text: theme.background };
    }
};

function clampContent(text: string, limit = 10) {
    const words = text.trim().split(/\s+/);
    const isLong = words.length > limit;
    const preview = isLong ? words.slice(0, limit).join(" ") + "..." : text;
    return { isLong, preview, full: text };
}

// --- Sub-Components ---

const TimelineItem = React.memo(({ activity, theme, colorScheme }: any) => {
    const [expanded, setExpanded] = useState(false);
    const content = activity.content || activity.activity || activity.activity_text || "";
    const { isLong, preview, full } = clampContent(content, 12);
    const dateStr = formatActivityTime(activity.timestamp || activity.created_at);

    return (
        <View style={styles.timelineItem}>
            <View style={[styles.timelineConnectLine, { backgroundColor: colorScheme === 'dark' ? '#334155' : '#E2E8F0' }]} />
            <View style={[styles.timelineDot, { backgroundColor: theme.background, borderColor: theme.tint }]}>
                <View style={[styles.timelineDotInner, { backgroundColor: theme.tint }]} />
            </View>
            <View style={[styles.timelineContentCard, { backgroundColor: theme.background, borderColor: colorScheme === 'dark' ? '#334155' : '#F1F5F9' }]}>
                <Text style={[styles.timelineTime, { color: theme.sub }]}>{dateStr}</Text>
                <Text style={[styles.activityText, { color: theme.text }]}>
                    {expanded ? full : preview}
                    {isLong && (
                        <Text style={{ color: theme.tint, fontWeight: '600' }} onPress={() => setExpanded(!expanded)}>
                            {expanded ? " See less" : " See more"}
                        </Text>
                    )}
                </Text>
            </View>
        </View>
    );
});

// --- Main Screen ---

export default function LeadDetails() {
    const params = useLocalSearchParams();
    const navigation = useNavigation();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { leads, updateLead, updateLeadStatus } = useLeads() as any;
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const scrollViewRef = useRef<ScrollView>(null);

    const [isEditing, setIsEditing] = useState(false);
    const [activities, setActivities] = useState<any[]>([]);
    const [loadingActivities, setLoadingActivities] = useState(false);
    const [newNote, setNewNote] = useState("");
    const [statusDropdownVisible, setStatusDropdownVisible] = useState(false);
    const [calendarModalVisible, setCalendarModalVisible] = useState(false);

    // Initial Data Normalization
    const leadId = params.id;
    const contextLead = useMemo(() => (leads || []).find((l: any) => l.id.toString() === leadId?.toString()), [leads, leadId]);

    const [formData, setFormData] = useState(() => {
        const base = contextLead || params;
        return {
            ...base,
            name: base.name || base.fullName || 'Unnamed Lead',
            casetype: base.casetype || base.caseType || base.service || 'General Inquiry',
            phone: base.phone || '-',
            email: base.email || '-',
            court: base.court || '-',
            assigned: base.assigned || '-',
            date: base.created_at || base.date || '-'
        };
    });

    useEffect(() => {
        if (contextLead) setFormData(contextLead);
    }, [contextLead]);

    const fetchActivities = useCallback(async () => {
        if (!leadId) return;
        setLoadingActivities(true);
        try {
            const res = await leadService.getActivities(leadId.toString());
            const fetched = res.activities || res.data || (Array.isArray(res) ? res : []);
            setActivities(fetched.sort((a: any, b: any) =>
                new Date(b.timestamp || b.created_at).getTime() - new Date(a.timestamp || a.created_at).getTime()
            ));
        } catch (e) { } finally { setLoadingActivities(false); }
    }, [leadId]);

    useEffect(() => { fetchActivities(); }, [fetchActivities]);

    useLayoutEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    const handleStatusChange = async (val: string) => {
        const STATUS_CONNECTION_MAP: Record<string, boolean> = { "In Progress": true, "Declined": false, "Completed": true };
        try {
            const connected = STATUS_CONNECTION_MAP[val] ?? false;
            await updateLeadStatus(formData.id, val, connected, "mobile updation");
            setFormData((prev: any) => ({ ...prev, status: val }));
            await leadService.addActivity(leadId!.toString(), `Status updated to ${val}`);
            fetchActivities();
        } catch (error) { console.error(error); }
        setStatusDropdownVisible(false);
    };

    const handlePostActivity = async () => {
        if (!newNote.trim() || !leadId) return;
        try {
            await leadService.addActivity(leadId.toString(), newNote);
            setNewNote("");
            fetchActivities();
            setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 200);
        } catch (e) { }
    };

    const statusInfo = getStatusColor(formData.status, theme);

    return (
        <View style={{ flex: 1 }}>
            {/* Modern Header */}
            <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: theme.background, borderBottomColor: colorScheme === 'dark' ? '#1E293B' : '#F1F5F9' }]}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <ArrowLeft size={24} color={theme.text} />
                    </TouchableOpacity>
                    <View>
                        <Text style={[styles.headerTitle, { color: theme.text }]}>{formData.name}</Text>
                        <TouchableOpacity
                            style={[styles.statusBadge, { backgroundColor: statusInfo.bg + '20' }]}
                            onPress={() => setStatusDropdownVisible(!statusDropdownVisible)}
                        >
                            <View style={[styles.statusDot, { backgroundColor: statusInfo.bg }]} />
                            <Text style={[styles.statusText, { color: statusInfo.bg }]}>{formData.status}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.circleActionBtn} onPress={() => Linking.openURL(`tel:${formData.phone}`)}>
                        <Phone size={20} color={theme.tint} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.circleActionBtn} onPress={() => Linking.openURL(`https://wa.me/91${formData.phone.replace(/\D/g, '')}`)}>
                        <Ionicons name="logo-whatsapp" size={22} color="#22c55e" />
                    </TouchableOpacity>
                </View>

                {statusDropdownVisible && (
                    <View style={[styles.floatingDropdown, { top: insets.top + 70, backgroundColor: theme.background, borderColor: colorScheme === 'dark' ? '#334155' : '#E2E8F0' }]}>
                        {['In Progress', 'Declined', 'Completed'].map((s) => (
                            <TouchableOpacity key={s} style={styles.dropdownItem} onPress={() => handleStatusChange(s)}>
                                <Text style={[styles.dropdownItemText, { color: formData.status === s ? theme.tint : theme.text }]}>{s}</Text>
                                {formData.status === s && <CheckCircle2 size={16} color={theme.tint} />}
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>

            <ScrollView
                ref={scrollViewRef}
                showsVerticalScrollIndicator={true}
                contentContainerStyle={{ paddingBottom: 20 }}
                style={{ flex: 1 }}
            >
                <View style={styles.contentPadding}>
                    {/* Info Grid Card */}
                    <View style={[styles.card, { backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#FFFFFF' }]}>
                        <View style={styles.gridRow}>
                            <InfoItem label="Case Type" value={formData.casetype} theme={theme} />
                            <InfoItem label="Jurisdiction" value={formData.court} theme={theme} />
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.gridRow}>
                            <InfoItem label="Email" value={formData.email} theme={theme} />
                            <InfoItem label="Phone" value={maskPhoneNumber(formData.phone)} theme={theme} isLink color={theme.bl} />
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.gridRow}>
                            <InfoItem label="Assigned To" value={formData.assigned} theme={theme} style={[{ fontFamily: 'Poppins-Medium' }, { color: theme.sub }]} />
                            <InfoItem label="Date" value={new Date(formData.created_at || formData.date).toLocaleDateString()} theme={theme} />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.primaryBtn, { backgroundColor: theme.cal }]}
                        onPress={() => setCalendarModalVisible(true)}
                    >
                        <CalendarDays size={20} color={theme.cal2} />
                        <Text style={[{ color: theme.cal2 }, styles.primaryBtnText]}>Schedule Meeting</Text>
                    </TouchableOpacity>

                    {/* Activity Timeline */}
                    <View style={styles.sectionTitleRow}>
                        <ClipboardList size={20} color={theme.sub} />
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Activity Timeline</Text>
                    </View>

                    <View style={styles.timelineWrapper}>
                        {loadingActivities ? (
                            <ActivityIndicator color={theme.tint} style={{ marginTop: 20 }} />
                        ) : activities.length === 0 ? (
                            <Text style={[styles.emptyText, { color: theme.sub }]}>No history available</Text>
                        ) : (
                            activities.map((act, i) => <TimelineItem key={i} activity={act} theme={theme} colorScheme={colorScheme} />)
                        )}
                    </View>
                </View>
            </ScrollView>
            <CalendarModal visible={calendarModalVisible} onClose={() => setCalendarModalVisible(false)} lead={formData} />
            <KeyboardStickyView offset={{ closed: 0, opened: 0 }}>
                <View style={{ paddingBottom: insets.bottom || 20, paddingTop: 10, paddingHorizontal: 20, backgroundColor: theme.background, borderTopWidth: 1, borderTopColor: colorScheme === 'dark' ? '#1E293B' : '#F1F5F9' }}>
                    <View style={[styles.inputContainer, { backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#F1F5F9' }]}>
                        <TextInput
                            style={[styles.input, { color: theme.text }]}
                            placeholder="Add a note..."
                            placeholderTextColor={theme.sub}
                            value={newNote}
                            onChangeText={setNewNote}
                            multiline
                        />
                        <TouchableOpacity
                            style={[styles.sendBtn, { backgroundColor: newNote.trim() ? theme.tint : (colorScheme === 'dark' ? '#334155' : '#E2E8F0') }]}
                            onPress={handlePostActivity}
                            disabled={!newNote.trim()}
                        >
                            <Send size={18} color={newNote.trim() ? '#FFF' : theme.sub} />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardStickyView>
        </View>
    );
}

const InfoItem = ({ label, value, theme, isLink, color }: any) => (
    <View style={styles.infoItem}>
        <Text style={[styles.infoLabel, { color: theme.sub }]}>{label ? label : '-'}</Text>
        <Text style={[styles.infoValue, { color: color || theme.text, textDecorationLine: isLink ? 'underline' : 'none' }]}>{value ? value : '-'}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 15, borderBottomWidth: 1, zIndex: 100 },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    headerTitle: { fontSize: 18, fontWeight: '700' },
    backBtn: { padding: 4 },
    statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginTop: 4 },
    statusDot: { width: 6, height: 6, borderRadius: 3 },
    statusText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
    headerActions: { flexDirection: 'row', gap: 10 },
    circleActionBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
    contentPadding: { padding: 20 },
    card: { borderRadius: 20, padding: 10, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
    gridRow: { flexDirection: 'row', paddingVertical: 10 },
    infoItem: { flex: 1, paddingHorizontal: 10 },
    infoLabel: { fontSize: 10, fontWeight: '600', textTransform: 'uppercase', marginBottom: 4 },
    infoValue: { fontSize: 14, fontWeight: '500' },
    divider: { height: 1, backgroundColor: '#E2E8F0', opacity: 0.3, marginHorizontal: 10 },
    primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 16, borderRadius: 16, marginBottom: 25 },
    primaryBtnText: { fontSize: 16, fontWeight: '600' },
    sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
    sectionTitle: { fontSize: 16, fontWeight: '700' },
    timelineWrapper: { paddingLeft: 10 },
    timelineItem: { flexDirection: 'row', gap: 15, marginBottom: 20 },
    timelineConnectLine: { position: 'absolute', left: 10, top: 20, bottom: -20, width: 2 },
    timelineDot: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
    timelineDotInner: { width: 8, height: 8, borderRadius: 4 },
    timelineContentCard: { flex: 1, padding: 15, borderRadius: 15, borderWidth: 1 },
    timelineTime: { fontSize: 11, fontWeight: '600', marginBottom: 5 },
    activityText: { fontSize: 14, lineHeight: 20 },
    footer: { flex: 1, alignItems: 'center' },
    inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 8, borderRadius: 25, paddingLeft: 15 },
    input: { flex: 1, maxHeight: 100, fontSize: 15, paddingVertical: 8 },
    sendBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
    floatingDropdown: { position: 'absolute', left: 20, width: 180, borderRadius: 15, borderWidth: 1, padding: 5, elevation: 10, shadowColor: '#000', shadowOpacity: 0.1 },
    dropdownItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderRadius: 10 },
    dropdownItemText: { fontWeight: '600', fontSize: 14 },
    emptyText: { textAlign: 'center', marginTop: 20, fontSize: 14 }
});