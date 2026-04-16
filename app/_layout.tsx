import { ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import 'react-native-reanimated';

import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Platform, Text, useColorScheme, View } from 'react-native';
import { CalendarProvider } from '../context/CalendarContext';
import { LeadProvider } from '../context/LeadContext';
// import { NotificationProvider } from '../context/NotificationContext';

import { NotificationProvider } from '@/context/NotificationContext';
import { AppDarkTheme, AppLightTheme } from '@/hooks/use-color-scheme';
import { bootstrapAuth } from '@/scripts/bootstrapLogin';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold
} from '@expo-google-fonts/poppins';
import messaging from '@react-native-firebase/messaging';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Notification Listener
messaging().setBackgroundMessageHandler(async (remoteMessage: any) => {
  console.log('[FCM BACKGROUND from layout]', remoteMessage);
});




SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [ready, setReady] = useState(false);
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Poppins': Poppins_400Regular,
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold
  });
  console.log('first RootLayout rendered')
  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      const authState = await bootstrapAuth();
      setIsAuthenticated(authState);
      setReady(true)
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);



  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);


  useEffect(() => {
    if (!ready) return;

    if (isAuthenticated) {
      router.replace("/(tabs)/Dashboard");
    } else {
      router.replace("/(auth)/Login");
    }
  }, [ready, isAuthenticated]);


  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }


  if (!ready) return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Loading</Text>

  </View>;

  return (
    <KeyboardProvider>
      <SafeAreaProvider>
        <NotificationProvider>
          <LeadProvider>
            <CalendarProvider>
              <ThemeProvider value={colorScheme === 'dark' ? AppDarkTheme : AppLightTheme}>
                <Stack
                  screenOptions={{
                    animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
                  }}
                >


                  <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="Reset" options={{ headerShown: false }} />
                  <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
                  <Stack.Screen name="NotificationTest" options={{ headerShown: false }} />
                  <Stack.Screen name="LeadDetails" options={{ headerShown: false }} />
                  <Stack.Screen name="AdvocateProfile" options={{ headerShown: false }} />
                  <Stack.Screen name="Calendar" options={{ headerShown: false }} />
                  <Stack.Screen name="Privacy" options={{ headerShown: false }} />
                  <Stack.Screen name="support" options={{ headerShown: false }} />
                </Stack>
                <StatusBar style="auto" />

              </ThemeProvider>
            </CalendarProvider>
          </LeadProvider>
        </NotificationProvider>

      </SafeAreaProvider>
    </KeyboardProvider>
  );

}
