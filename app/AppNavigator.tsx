import { ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import 'react-native-gesture-handler';
import 'react-native-reanimated';

import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Text, useColorScheme, View } from 'react-native';
import { CalendarProvider } from '../context/CalendarContext';
import { LeadProvider } from '../context/LeadContext';
// import { NotificationProvider } from '../context/NotificationContext';

import { useAuth } from '@/context/Authcontext';
import { NotificationProvider } from '@/context/NotificationContext';
import { AppDarkTheme, AppLightTheme } from '@/hooks/use-color-scheme';
import {
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold
} from '@expo-google-fonts/poppins';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Notification Listener
// messaging().setBackgroundMessageHandler(async (remoteMessage: any) => {
//     console.log('[FCM BACKGROUND from layout]', remoteMessage);
// });




SplashScreen.preventAutoHideAsync();

export function AppNavigator() {
    const colorScheme = useColorScheme();
    const router = useRouter();

    const { isAuthenticated, isLoading } = useAuth();

    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
        'Poppins': Poppins_400Regular,
        'Poppins-Regular': Poppins_400Regular,
        'Poppins-Medium': Poppins_500Medium,
        'Poppins-SemiBold': Poppins_600SemiBold
    });

    useEffect(() => {
        if (loaded && !isLoading) {
            SplashScreen.hideAsync();
        }
    }, [loaded, isLoading]);
    useEffect(() => {
        if (!isLoading) {
            if (isAuthenticated) {
                console.log('authenticated in app navigator 🫵🏻 🎶👀🚀 ', isAuthenticated)
                router.replace('/(tabs)/Dashboard');
            } else {
                router.replace('/(auth)/Login');
            }
        }
    }, [isLoading, isAuthenticated]);

    if (isLoading) return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading</Text>

    </View>;


    return (
        <SafeAreaProvider>
            <NotificationProvider>
                <LeadProvider>
                    <CalendarProvider>
                        <ThemeProvider value={colorScheme === 'dark' ? AppDarkTheme : AppLightTheme}>
                            <Stack>
                                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                                <Stack.Screen name="AdvocateProfile" options={{ headerShown: false }} />
                                <Stack.Screen name="Calendar" options={{ headerShown: false }} />
                                <Stack.Screen name="Privacy" options={{ headerShown: false }} />
                                <Stack.Screen name="Reset" options={{ headerShown: false }} />
                                <Stack.Screen name="support" options={{ headerShown: false }} />
                                <Stack.Screen name="Settings" options={{ headerShown: false }} />
                            </Stack>
                        </ThemeProvider>
                    </CalendarProvider>
                </LeadProvider>
            </NotificationProvider>
        </SafeAreaProvider>
    );
}