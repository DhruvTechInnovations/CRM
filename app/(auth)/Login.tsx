import { authService } from '@/services/apiService';
// import notifee from '@notifee/react-native';
import privateApi from '@/services/privateapi';
import CheckBox from "expo-checkbox";
import { useRouter } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { Eye, EyeOff } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useColorScheme
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../../constants/theme";
import { useAuth } from '../../context/Authcontext';
import { listenForegroundNotifications } from '../../services/notification/notification.handlers';
import { setupNotificationNavigation } from '../../services/notification/notification.navigation';
import { initNotifications } from '../../services/notification/notification.service';
import Terms from "../Terms";



const logo = require('../../assets/images/icon.png');

// messaging().setBackgroundMessageHandler(async remoteMessage => {
//     console.log('[FCM BACKGROUND]', remoteMessage);
// });


const FCM_TOKEN_KEY = 'fcmToken';
export default function LoginScreen({ navigation }: any) {
    useEffect(() => {
        initNotifications();
        setupNotificationNavigation(navigation);
        listenForegroundNotifications((msg: any) => {
            console.log('[FCM FOREGROUND]', msg);
        });

        // const unsubFg = messaging().onMessage(async msg => {
        //     await notifee.displayNotification({
        //         title: msg.notification?.title,
        //         body: msg.notification?.body,
        //         android: { channelId: 'default' },
        //     });
        // });

        // ✅ Cleanup — prevents listener leak
        // return () => unsubFg();

    }, []);
    console.log('first login rendered ')
    const router = useRouter();
    const { state } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [agree, setAgree] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const insets = useSafeAreaInsets()
    const [showPassword, setShowPassword] = useState(false);

    // if (state === 'loading' || state === 'authenticated') {
    //     return (
    //         <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
    //             <ActivityIndicator size="large" color={theme.text} />
    //         </View>
    //     );
    // }

    const handleLogin = async () => {
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/;
        function isValidGmail(email: string) {
            return gmailRegex.test(email)
        };
        if (!isValidGmail(email)) {
            Alert.alert("Error", "Please enter valid email.");
            return;
        }


        if (!email || !password) {
            Alert.alert("Error", "Please enter email and password.");
            return;
        }

        if (!agree) {
            Alert.alert("Error", "Please accept Terms & Conditions.");
            return;
        }


        try {
            // API Call: Await the login response
            const res = await authService.login(email, password);
            console.log("Login Response", res);

            const fcmToken = await SecureStore.getItemAsync(FCM_TOKEN_KEY);

            if (fcmToken) {
                await privateApi.post('/fcm-token', {
                    token: fcmToken,
                });
            }
            // Navigate only after successful login
            router.replace("/(tabs)/Dashboard");
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Unable to connect to server.';
            Alert.alert('Login Failed', errorMessage);
        }
    };

    const handleAcceptTerms = () => {
        setAgree(true);
        setModalVisible(false);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.contentContainer}>
                {/* Logo Section */}
                <View style={styles.logoContainer}>
                    <Image source={logo} style={styles.logo} resizeMode="contain" />
                </View>

                {/* Typography Header */}
                <View style={styles.headerTextContainer}>
                    <Text style={[styles.title, { color: theme.text }]}>JP Law Suvidha</Text>
                    <Text style={[styles.subtitle, { color: theme.sub }]}>Sign in to access your legal workspace</Text>
                </View>

                {/* Input Fields Container */}
                <View style={styles.formContainer}>
                    {/* Email Input */}
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#F8FAFC',
                                    borderColor: colorScheme === 'dark' ? '#334155' : '#F1F5F9',
                                    color: theme.text
                                }
                            ]}
                            placeholder="Email Address"
                            placeholderTextColor={theme.sub}
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Password Input */}
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#F8FAFC',
                                    borderColor: colorScheme === 'dark' ? '#334155' : '#F1F5F9',
                                    color: theme.text
                                }
                            ]}
                            placeholder="Password"
                            placeholderTextColor={theme.sub}
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            style={styles.eyeIcon}
                            activeOpacity={0.6}
                        >
                            {showPassword ? (
                                <EyeOff size={22} color={theme.sub} />
                            ) : (
                                <Eye size={22} color={theme.sub} />
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Forgot Password Link */}
                    <TouchableOpacity
                        onPress={() => router.push('/Reset')}
                        style={styles.forgotBtn}
                        activeOpacity={0.6}
                    >
                        <Text style={[styles.forgotText, { color: theme.link }]}>Forgot Password?</Text>
                    </TouchableOpacity>

                    {/* Terms & Conditions */}
                    <View style={styles.checkboxContainer}>
                        <CheckBox
                            value={agree}
                            onValueChange={setAgree}
                            color={agree ? theme.tint : theme.sub}
                            style={styles.checkbox}
                        />
                        <Text style={[styles.checkboxText, { color: theme.sub }]}>
                            I agree to the{" "}
                            <Text
                                style={[styles.link, { color: theme.link }]}
                                onPress={() => setModalVisible(true)}
                            >
                                Terms and Conditions
                            </Text>
                        </Text>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={[styles.loginBtn, { backgroundColor: theme.text }]}
                        onPress={handleLogin}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.loginText, { color: theme.background }]}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Regulatory Footer */}
            <View style={[styles.footerContainer, { paddingBottom: Math.max(insets.bottom, 12), marginBottom: 10 }]}>
                <Text
                    style={[
                        styles.footerText, { color: theme.sub }
                    ]}
                > 🔒 Enterprise-grade security. GDPR & CCPA Compliant.
                </Text>
            </View>

            <Terms
                visible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onAccept={handleAcceptTerms}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 32,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logo: {
        width: 120,
        height: 120,
        borderRadius: 20,
    },
    headerTextContainer: {
        marginBottom: 40,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        letterSpacing: -1,
        marginBottom: 0,
        fontFamily: 'Poppins-SemiBold',
    },
    subtitle: {
        fontSize: 15,
        textAlign: 'center',
        fontFamily: 'Poppins-Medium',
    },
    formContainer: {
        width: '100%',
        gap: 16,
    },
    inputWrapper: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        height: 56,
        borderWidth: 1.5,
        borderRadius: 16,
        paddingHorizontal: 20,
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
    },
    eyeIcon: {
        position: 'absolute',
        right: 18,
        height: '100%',
        justifyContent: 'center',
    },
    forgotBtn: {
        alignSelf: 'flex-end',
        paddingVertical: 4,
    },
    forgotText: {
        fontSize: 14,
        fontFamily: 'Poppins-SemiBold',
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
        marginBottom: 8,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 6,
    },
    checkboxText: {
        marginLeft: 12,
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
        lineHeight: 20,
        flex: 1,
    },
    link: {
        textDecorationLine: 'underline',
        fontFamily: 'Poppins-SemiBold',
    },
    loginBtn: {
        height: 58,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: 'center',
        marginTop: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
    },
    loginText: {
        fontSize: 17,
        fontFamily: 'Poppins-Bold'
    },
    footerContainer: {
        paddingHorizontal: 20,
    },
    footerText: {
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 18,
        fontFamily: 'Poppins-Medium',
    },
});