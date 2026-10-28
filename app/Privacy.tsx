import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PrivacyPolicy() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.card }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Privacy & Policy</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Introduction */}
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Introduction</Text>
                    <Text style={[styles.paragraph, { color: colors.text }]}>
                        JP Law Suvidha ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application.
                    </Text>
                </View>

                {/* Information We Collect */}
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Information We Collect</Text>
                    <Text style={[styles.subTitle, { color: colors.text }]}>Personal Information</Text>
                    <Text style={[styles.paragraph, { color: colors.text }]}>
                        We collect information that you provide directly to us, including:
                    </Text>
                    <View style={styles.bulletList}>
                        <Text style={[styles.bullet, { color: colors.text }]}>• Name and contact information</Text>
                        <Text style={[styles.bullet, { color: colors.text }]}>• Email address and phone number</Text>
                        <Text style={[styles.bullet, { color: colors.text }]}>• Bar Council ID and professional credentials</Text>
                        <Text style={[styles.bullet, { color: colors.text }]}>• Case and client information</Text>
                    </View>
                </View>

                {/* How We Use Your Information */}
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>How We Use Your Information</Text>
                    <Text style={[styles.paragraph, { color: colors.text }]}>
                        We use the information we collect to:
                    </Text>
                    <View style={styles.bulletList}>
                        <Text style={[styles.bullet, { color: colors.text }]}>• Provide, maintain, and improve our services</Text>
                        <Text style={[styles.bullet, { color: colors.text }]}>• Process and manage your cases</Text>
                        <Text style={[styles.bullet, { color: colors.text }]}>• Send you technical notices and support messages</Text>
                        <Text style={[styles.bullet, { color: colors.text }]}>• Respond to your comments and questions</Text>
                        <Text style={[styles.bullet, { color: colors.text }]}>• Protect against fraudulent or illegal activity</Text>
                    </View>
                </View>

                {/* Data Security */}
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Data Security</Text>
                    <Text style={[styles.paragraph, { color: colors.text }]}>
                        We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes:
                    </Text>
                    <View style={styles.bulletList}>
                        <Text style={[styles.bullet, { color: colors.text }]}>• End-to-end encryption for sensitive data</Text>
                        <Text style={[styles.bullet, { color: colors.text }]}>• Secure socket layer (SSL) technology</Text>
                        <Text style={[styles.bullet, { color: colors.text }]}>• Regular security audits and updates</Text>
                        <Text style={[styles.bullet, { color: colors.text }]}>• Access controls and authentication</Text>
                    </View>
                </View>

                {/* Your Rights */}
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Rights</Text>
                    <Text style={[styles.paragraph, { color: colors.text }]}>
                        You have the right to:
                    </Text>
                    <View style={styles.bulletList}>
                        <Text style={[styles.bullet, { color: colors.text }]}>• Access your personal information</Text>
                        <Text style={[styles.bullet, { color: colors.text }]}>• Correct inaccurate data</Text>
                        <Text style={[styles.bullet, { color: colors.text }]}>• Request deletion of your data</Text>
                        <Text style={[styles.bullet, { color: colors.text }]}>• Object to processing of your data</Text>
                        <Text style={[styles.bullet, { color: colors.text }]}>• Data portability</Text>
                    </View>
                </View>

                {/* Contact Us */}
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Contact Us</Text>
                    <Text style={[styles.paragraph, { color: colors.text }]}>
                        If you have any questions about this Privacy Policy, please contact us at:
                    </Text>
                    <Text style={[styles.contactText, { color: '#3b82f6' }]}>support@jplawsuvidha.com</Text>
                </View>

                {/* Last Updated */}
                <Text style={[styles.lastUpdated, { color: colors.text }]}>
                    Last Updated: March 2026
                </Text>
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
        marginBottom: 12,
    },
    subTitle: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        marginTop: 8,
        marginBottom: 8,
    },
    paragraph: {
        fontSize: 14,
        lineHeight: 22,
        marginBottom: 12,
        fontFamily: 'Poppins-Regular',
        opacity: 0.8,
    },
    bulletList: {
        marginLeft: 8,
    },
    bullet: {
        fontSize: 14,
        lineHeight: 24,
        fontFamily: 'Poppins-Regular',
        opacity: 0.8,
    },
    contactText: {
        fontSize: 14,
        fontFamily: 'Poppins-SemiBold',
        marginTop: 8,
    },
    lastUpdated: {
        fontSize: 12,
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 10,
        fontFamily: 'Poppins-Regular',
        opacity: 0.6,
    },
});
