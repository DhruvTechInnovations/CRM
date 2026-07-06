import { FileText, X } from 'lucide-react-native';
import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TermsProps {
    visible: boolean;
    onClose: () => void;
    onAccept: () => void;
}

const Terms: React.FC<TermsProps> = ({ visible, onClose, onAccept }) => (
    <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
    >
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <View style={styles.iconContainer}>
                            <FileText size={20} color="#3b82f6" />
                        </View>
                        <View>
                            <Text style={styles.title}>Terms and Conditions</Text>
                            <Text style={styles.subtitle}>Legal Platform Usage Agreement</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <X size={20} color="#9ca3af" />
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <ScrollView style={styles.content}>
                    <View style={styles.proseContainer}>
                        <Section title="1. Platform Access & Usage">
                            <Text style={styles.paragraph}>By accessing this legal portal, you acknowledge that you are a licensed legal professional or authorized personnel with legitimate access to this system.</Text>
                        </Section>
                        <Section title="2. Confidentiality & Privacy">
                            <BulletItem text="Maintain strict confidentiality of all client information" />
                            <BulletItem text="Protect attorney-client privilege at all times" />
                            <BulletItem text="Report any potential data breaches immediately" />
                            <BulletItem text="Use secure networks and devices only" />
                        </Section>
                        <Section title="3. Professional Responsibility">
                            <BulletItem text="Comply with all applicable legal and ethical standards" />
                            <BulletItem text="Use the platform only for legitimate legal purposes" />
                            <BulletItem text="Maintain accurate and up-to-date professional credentials" />
                            <BulletItem text="Follow all firm policies and procedures" />
                        </Section>
                        <Section title="4. Security Requirements">
                            <BulletItem text="Protect your login credentials and enable two-factor authentication" />
                            <BulletItem text="Log out from shared or public devices" />
                            <BulletItem text="Report suspicious activity immediately" />
                            <BulletItem text="Use strong, unique passwords" />
                        </Section>
                    </View>
                </ScrollView>

                {/* Footer */}
                <View style={styles.footer}>
                    <TouchableOpacity onPress={onAccept} style={styles.acceptButton}>
                        <Text style={styles.acceptButtonText}>Accept & Continue</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </Modal>
);

// Helper Components
interface SectionProps {
    title: string;
    children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {children}
    </View>
);

interface BulletItemProps {
    text: string;
}

const BulletItem: React.FC<BulletItemProps> = ({ text }) => (
    <View style={styles.bulletItem}>
        <Text style={styles.bulletText}>• </Text>
        <Text style={styles.bulletText}>{text}</Text>
    </View>
);

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 16,
        width: '90%',
        maxHeight: '80%',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 36,
        height: 36,
        backgroundColor: '#eff6ff',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    title: {
        fontSize: 18,
        color: '#111827',
        fontFamily: 'Poppins-Bold',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 11,
        color: '#64748b',
        fontFamily: 'Poppins-Medium',
        marginTop: -2,
    },
    closeButton: {
        padding: 4,
        marginTop: -4,
        marginRight: -4,
    },
    content: {
        paddingHorizontal: 24,
        paddingVertical: 16,
        maxHeight: 400,
    },
    proseContainer: {
        flex: 1,
        gap: 16,
    },
    section: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        color: '#111827',
        marginBottom: 8,
        fontFamily: 'Poppins-SemiBold',
    },
    paragraph: {
        fontSize: 14,
        color: '#4b5563',
        lineHeight: 20,
        fontFamily: 'Poppins-Regular',
    },
    bulletItem: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    bulletText: {
        fontSize: 14,
        color: '#4b5563',
        lineHeight: 20,
        fontFamily: 'Poppins-Regular',
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        backgroundColor: '#f9fafb',
    },
    acceptButton: {
        backgroundColor: '#2563eb',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    acceptButtonText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
    },
});

export default Terms;