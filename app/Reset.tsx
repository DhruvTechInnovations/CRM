import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useColorScheme
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { authService } from '@/services/apiService';
import { ScrollView } from 'react-native';


export default function ResetPassword() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const isDark = colorScheme === 'dark';
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const validateEmail = (email: any) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleResetPassword = async () => {
        if (!email.trim()) {
            Alert.alert('Error', 'Please enter your email address');
            return;
        }

        if (!validateEmail(email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        setLoading(true);
        try {
            const res = await authService.resetPassword(email);
            if (res.status == 'success') {
                setTimeout(() => {
                    setLoading(false);
                    Alert.alert(
                        'Success',
                        `A password reset link has been sent to ${email}. Please check your email.`,
                        [
                            {
                                text: 'OK',
                                onPress: () => router.back(),
                            },
                        ]
                    );
                }, 1500);
            }
            else {
                Alert.alert(res.message);
                setLoading(false);
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Unable to connect to server.';
            Alert.alert('Login Failed', errorMessage);
        }

        // Simulation
        // setTimeout(() => {
        //     setLoading(false);
        //     Alert.alert(
        //         'Success',
        //         `A password reset link has been sent to ${email}. Please check your email.`,
        //         [
        //             {
        //                 text: 'OK',
        //                 onPress: () => router.back(),
        //             },
        //         ]
        //     );
        // }, 1500);
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
        >
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                {/* Header */}
                <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: theme.background }]}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>Reset Password</Text>
                    <View style={{ width: 40 }} />
                </View>


                {/* Content */}
                <View style={styles.content}>
                    {/* Icon */}
                    <View style={styles.iconContainer}>
                        <Ionicons name="lock-closed-outline" size={64} color={theme.tint} />
                    </View>

                    {/* Title and Description */}
                    <Text style={[styles.title, { color: theme.text }]}>Forgot Your Password?</Text>
                    <Text style={[styles.description, { color: theme.icon }]}>
                        Enter your email address and we'll send you a link to reset your password.
                    </Text>

                    {/* Email Input */}
                    <View style={[styles.card, { backgroundColor: 'transparent', padding: 0, shadowOpacity: 0 }]}>
                        <Text style={[styles.label, { color: theme.text }]}>Email Address</Text>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#F8FAFC',
                                    borderColor: colorScheme === 'dark' ? '#334155' : '#F1F5F9',
                                    color: theme.text
                                }
                            ]}
                            placeholder="Enter your email"
                            placeholderTextColor={theme.icon}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                            editable={!loading}
                        />
                    </View>

                    {/* Send Button */}
                    <TouchableOpacity
                        style={[
                            styles.sendButton,
                            { backgroundColor: loading ? theme.icon : theme.text },
                        ]}
                        onPress={handleResetPassword}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <Text style={[styles.buttonText, { color: theme.background }]}>Sending...</Text>
                        ) : (
                            <>
                                <Ionicons name="mail-outline" size={20} color={theme.background} />
                                <Text style={[styles.buttonText, { color: theme.background }]}>Send Reset Link</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    {/* Back to Login */}
                    <TouchableOpacity
                        style={styles.backToLogin}
                        onPress={() => router.replace('/(auth)/Login')}
                    >
                        <Ionicons name="arrow-back-circle-outline" size={18} color={theme.tint} />
                        <Text style={[styles.backToLoginText, { color: theme.tint }]}>
                            Back to Login
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Footer Info */}
                <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                    <View style={[styles.infoBox, { backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#eff6ff', borderLeftColor: theme.tint }]}>
                        <Ionicons name="information-circle-outline" size={20} color={theme.tint} />
                        <Text style={[styles.infoText, { color: theme.text }]}>
                            If you don't receive an email within 5 minutes, please check your spam folder or contact support.
                        </Text>
                    </View>
                </View>
            </View>
        </ScrollView>

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
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    scrollContent: {
        flexGrow: 1,
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontFamily: 'Poppins-SemiBold',
        textAlign: 'center',
        marginBottom: 12,
    },
    description: {
        fontSize: 14,
        textAlign: 'center',
        fontFamily: 'Poppins-Regular',
        opacity: 0.7,
        marginBottom: 32,
        lineHeight: 22,
    },
    card: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 0,
    },
    label: {
        fontSize: 14,
        fontFamily: 'Poppins-SemiBold',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1.5,
        borderRadius: 16,
        padding: 16,
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        height: 56,
    },
    sendButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        height: 58,
        borderRadius: 18,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
    },
    buttonText: {
        fontSize: 17,
        fontFamily: 'Poppins-SemiBold',
    },
    backToLogin: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
    },
    backToLoginText: {
        fontSize: 14,
        fontFamily: 'Poppins-SemiBold',
    },
    footer: {
        paddingHorizontal: 20,
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        padding: 12,
        backgroundColor: '#eff6ff',
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: '#3b82f6',
    },
    infoText: {
        flex: 1,
        fontSize: 12,
        lineHeight: 18,
        fontFamily: 'Poppins-Regular',
        opacity: 0.8,
    },
});
