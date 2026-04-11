import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HelpSupport() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const [expandedFaq, setExpandedFaq] = useState(null);

    const faqs = [
        {
            id: 1,
            question: 'How do I reset my password?',
            answer: 'Go to the drawer menu and select "Reset Password". Enter your email address and we\'ll send you a reset link.',
        },
        {
            id: 2,
            question: 'How do I update my profile information?',
            answer: 'Navigate to Profile from the drawer menu. Click on any field to edit it, then tap "Save Changes" at the bottom.',
        },
        {
            id: 3,
            question: 'Is my data secure?',
            answer: 'Yes, we use enterprise-grade encryption and follow industry standards including GDPR and CCPA compliance.',
        },
    ];

    const handleCall = () => {
        Linking.openURL('tel:+918019097373');
    };

    const handleEmail = () => {
        Linking.openURL('mailto:support@jplawsuvidha.com');
    };

    const handleWhatsApp = () => {
        Linking.openURL('https://wa.me/918019097373');
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.card }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Help & Support</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Contact Cards */}
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Contact Us</Text>

                    <TouchableOpacity style={styles.contactItem} onPress={handleEmail}>
                        <View style={styles.contactLeft}>
                            <View style={[styles.iconContainer, { backgroundColor: '#eff6ff' }]}>
                                <Ionicons name="mail" size={20} color="#3b82f6" />
                            </View>
                            <View>
                                <Text style={[styles.contactLabel, { color: colors.text }]}>Email</Text>
                                <Text style={[styles.contactValue, { color: '#3b82f6' }]}>support@jplawsuvidha.com</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#d4d4d4" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
                        <View style={styles.contactLeft}>
                            <View style={[styles.iconContainer, { backgroundColor: '#f0fdf4' }]}>
                                <Ionicons name="call" size={20} color="#22c55e" />
                            </View>
                            <View>
                                <Text style={[styles.contactLabel, { color: colors.text }]}>Phone</Text>
                                <Text style={[styles.contactValue, { color: '#22c55e' }]}>+91 8019097373</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#d4d4d4" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.contactItem} onPress={handleWhatsApp}>
                        <View style={styles.contactLeft}>
                            <View style={[styles.iconContainer, { backgroundColor: '#f0fdf4' }]}>
                                <Ionicons name="logo-whatsapp" size={20} color="#16a34a" />
                            </View>
                            <View>
                                <Text style={[styles.contactLabel, { color: colors.text }]}>WhatsApp</Text>
                                <Text style={[styles.contactValue, { color: '#16a34a' }]}>+91 8019097373</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#d4d4d4" />
                    </TouchableOpacity>
                </View>

                {/* FAQ Section */}
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Frequently Asked Questions</Text>

                    {faqs.map((faq) => (
                        <View key={faq.id} style={styles.faqItem}>
                            <TouchableOpacity
                                style={styles.faqQuestion}
                                onPress={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                            >
                                <Text style={[styles.questionText, { color: colors.text }]}>{faq.question}</Text>
                                <Ionicons
                                    name={expandedFaq === faq.id ? 'chevron-up' : 'chevron-down'}
                                    size={20}
                                    color={colors.text}
                                />
                            </TouchableOpacity>
                            {expandedFaq === faq.id && (
                                <Text style={[styles.answerText, { color: colors.text }]}>{faq.answer}</Text>
                            )}
                        </View>
                    ))}
                </View>

                {/* Support Hours */}
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Support Hours</Text>
                    <View style={styles.hoursRow}>
                        <Ionicons name="time-outline" size={20} color="#3b82f6" />
                        <Text style={[styles.hoursText, { color: colors.text }]}>
                            Monday - Friday: 9:00 AM - 6:00 PM IST
                        </Text>
                    </View>
                    <View style={styles.hoursRow}>
                        <Ionicons name="time-outline" size={20} color="#3b82f6" />
                        <Text style={[styles.hoursText, { color: colors.text }]}>
                            Saturday: 10:00 AM - 4:00 PM IST
                        </Text>
                    </View>
                    <Text style={[styles.note, { color: colors.text }]}>
                        We typically respond within 24 hours
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
    },
    scrollView: {
        flex: 1,
    },
    card: {
        marginHorizontal: 16,
        marginTop: 16,
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Poppins-Bold',
        marginBottom: 16,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    contactLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contactLabel: {
        fontSize: 12,
        opacity: 0.6,
        fontFamily: 'Poppins-Regular',
    },
    contactValue: {
        fontSize: 14,
        fontFamily: 'Poppins-SemiBold',
        marginTop: 2,
    },
    faqItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
        paddingVertical: 12,
    },
    faqQuestion: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    questionText: {
        fontSize: 14,
        fontFamily: 'Poppins-SemiBold',
        flex: 1,
        marginRight: 8,
    },
    answerText: {
        fontSize: 14,
        lineHeight: 22,
        marginTop: 8,
        fontFamily: 'Poppins-Regular',
        opacity: 0.7,
    },
    hoursRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    hoursText: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        flex: 1,
    },
    note: {
        fontSize: 12,
        opacity: 0.6,
        marginTop: 8,
        fontFamily: 'Poppins-Regular',
        fontStyle: 'italic',
    },
});
