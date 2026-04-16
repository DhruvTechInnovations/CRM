import { authService } from '@/services/apiService';
import { Ionicons } from '@expo/vector-icons';
import {
    DrawerContentScrollView
} from '@react-navigation/drawer';
import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Dimensions,
    Image,
    Platform,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const logo = require('../assets/images/icon.png');
const { width, height } = Dimensions.get('window');

export default function CustomDrawerContent(props: any) {
    const { colors } = useTheme();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const insets = useSafeAreaInsets();
    const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);

    const handleLogout = async () => {
        await authService.logout();
        router.replace('/(auth)/Login' as any);
    };

    const handleCloseDrawer = () => {
        props.navigation.closeDrawer();
    };

    // Dynamic colors based on theme
    const themeColors = {
        background: isDark ? '#000000' : '#FFFFFF',
        text: isDark ? '#FFFFFF' : '#000000',
        textSecondary: isDark ? '#999999' : '#666666',
        border: !isDark ? '#000000' : '#ffffff',
        cardBackground: isDark ? '#1A1A1A' : '#F5F5F5',
        iconBackground: isDark ? '#2A2A2A' : '#E5E5E5',
        iconBorder: isDark ? '#333333' : '#D0D0D0',
        logoutBtnBg: isDark ? '#333333' : '#AAAAAA',
        logoutBtnBorder: isDark ? '#444444' : '#999999',
        logoutBtnText: isDark ? '#FFFFFF' : '#000000',
        shadowColor: isDark ? '#FFFFFF' : '#000000',
        profileText: isDark ? '#FFFFFF' : '#000000',
        profileSubtext: isDark ? '#999999' : '#666666',
        closeIconBg: isDark ? '#1A1A1A' : '#F0F0F0',
    };

    return (
        <SafeAreaView
            style={[styles.safeArea, { backgroundColor: themeColors.background }]}
            edges={['top', 'left', 'right']}
        >
            {/* Close Drawer Button */}
            <TouchableOpacity
                style={[styles.closeButton, {
                    backgroundColor: themeColors.closeIconBg,
                }]}
                onPress={handleCloseDrawer}
                activeOpacity={0.7}
            >
                <Ionicons
                    name="chevron-back"
                    size={24}
                    color={themeColors.text}
                />
            </TouchableOpacity>

            <DrawerContentScrollView
                {...props}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header Section */}
                <View style={[styles.header, {
                    backgroundColor: themeColors.background,

                }]}>
                    <View>
                        <Image source={require('../assets/images/icon.png')} style={styles.logo} resizeMode="contain" />
                    </View>
                    <Text style={[styles.appName, { color: themeColors.text }]}>
                        JP Law Suvidha
                    </Text>
                    <Text style={[styles.tagline, { color: themeColors.textSecondary }]}>
                        Justice For People Driven By Technology
                    </Text>
                </View>
                {/* Custom Menu Items */}
                <View style={styles.customMenuSection}>
                    {[
                        { icon: 'person-outline', label: 'Profile', route: '/AdvocateProfile' },
                        // { icon: 'settings-outline', label: 'Settings', route: '/settings' },
                        { icon: 'calendar-outline', label: 'Calendar', route: '/Calendar' },
                        { icon: 'notifications-outline', label: 'Notifications', route: null },
                        { icon: 'shield-checkmark-outline', label: 'Privacy & Policy', route: '/Privacy' },
                        { icon: 'lock-closed-outline', label: 'Reset Password', route: '/Reset' },
                        { icon: 'help-circle-outline', label: 'Help & Support', route: '/support' },
                        { icon: 'notifications-outline', label: 'NotificationTest', route: '/NotificationTest' },
                    ].map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.menuItem}
                            onPress={() => {
                                if (item.label === 'Notifications') {
                                    setIsNotificationsEnabled(!isNotificationsEnabled);
                                } else if (item.route) {
                                    router.push(item.route as any);
                                } else {
                                }
                            }}
                        >
                            <View style={styles.menuItemLeft}>
                                <Ionicons name={item.icon as any} size={22} color={themeColors.textSecondary} />
                                <Text style={[styles.menuItemLabel, { color: themeColors.text }]}>{item.label}</Text>
                            </View>
                            {item.label !== 'Notifications' && <Ionicons name="chevron-forward" size={18} color={themeColors.border} />}
                            {item.label === 'Notifications' && (
                                <Switch
                                    trackColor={{ false: "#d1d5db", true: "black" }}
                                    thumbColor={isNotificationsEnabled ? "white" : "black"}
                                    ios_backgroundColor="#d1d5db"
                                    onValueChange={() => setIsNotificationsEnabled(previousState => !previousState)}
                                    value={isNotificationsEnabled}
                                    style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }} // Make it slightly smaller to fit better
                                />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            </DrawerContentScrollView>
            <View
                style={[
                    styles.footer,
                    {
                        backgroundColor: themeColors.background,
                        paddingBottom: Math.max(insets.bottom + 4, 16), // ✅ ensures safe space at bottom
                    },
                ]}
            >
                <TouchableOpacity
                    style={[
                        styles.logoutBtn,
                        {
                            backgroundColor: themeColors.logoutBtnBg,
                            borderColor: themeColors.logoutBtnBorder,
                            shadowColor: themeColors.shadowColor,
                        },
                    ]}
                    onPress={handleLogout}
                    activeOpacity={0.8}
                >
                    <Ionicons
                        name="log-out-outline"
                        size={22}
                        color={themeColors.logoutBtnText}
                    />
                    <Text style={[styles.logoutText, { color: themeColors.logoutBtnText }]}>
                        Logout
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },

    closeButton: {
        position: 'absolute',
        top: Platform.select({
            ios: height > 800 ? 60 : 50,
            android: 50,
            default: 50,
        }),
        left: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        borderWidth: 0,
        ...Platform.select({
            ios: {
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },

    scrollContent: {
        paddingTop: 0,
        flexGrow: 1,
    },

    // Header Section
    header: {
        alignItems: 'center',
        paddingTop: Platform.select({
            ios: height > 800 ? 70 : 50,
            android: 50,
            default: 50,
        }),
        paddingBottom: Platform.select({
            ios: height > 800 ? 32 : 24,
            android: 24,
            default: 24,
        }),
        paddingHorizontal: 20,
        borderBottomWidth: 0,
    },

    logoContainer: {
        width: 100,
        height: 100,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        ...Platform.select({
            ios: {
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },

    logo: {
        width: 100,
        height: 100,
        borderRadius: 16,
    },

    appName: {
        fontSize: Platform.select({
            ios: 24,
            android: 22,
            default: 24,
        }),
        fontFamily: 'Poppins-SemiBold',
        letterSpacing: 0.5,
        textAlign: 'center',
        marginBottom: 0,
    },

    tagline: {
        fontSize: Platform.select({
            ios: 13,
            android: 12,
            default: 13,
        }),
        letterSpacing: 0.3,
        textAlign: 'center',
        fontFamily: 'Poppins-Medium',
    },

    // User Info Section
    userInfoSection: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderBottomWidth: 1,
    },
    avatarRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        marginRight: 16,
    },
    userDetails: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    userRole: {
        fontSize: 14,
        marginTop: 2,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 10,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statNumber: {
        fontSize: 16,
        fontWeight: '700',
    },
    statLabel: {
        fontSize: 12,
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: 24,
    },

    // Custom Menu
    customMenuSection: {
        marginTop: 10,
        paddingHorizontal: 20,
        paddingBottom: 20,
        fontFamily: 'Poppins-Regular',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        fontFamily: 'Poppins-Regular',
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    menuItemLabel: {
        fontSize: 15,
        fontFamily: 'Poppins-Regular',
    },

    // Drawer List
    drawerList: {
        marginTop: 20,
        marginHorizontal: 12,
        flex: 1,
    },

    // Footer / Logout
    footer: {
        borderTopWidth: 0,
        paddingVertical: Platform.select({
            ios: 16,
            android: 16,
            default: 16,
        }),
        paddingHorizontal: 20,
        paddingBottom: Platform.select({
            ios: 30,
            android: 16,
            default: 16,
        }),
    },

    logoutBtn: {
        flexDirection: 'row',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Platform.select({
            ios: 14,
            android: 14,
            default: 14,
        }),
        gap: 10,
        borderWidth: 1,
        ...Platform.select({
            ios: {
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },

    logoutText: {
        fontSize: Platform.select({
            ios: 16,
            android: 15,
            default: 16,
        }),
        fontFamily: 'Poppins-SemiBold',
        letterSpacing: 0.5,
    },
});