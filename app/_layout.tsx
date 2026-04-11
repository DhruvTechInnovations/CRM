
import { ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import 'react-native-reanimated';

import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Platform, useColorScheme } from 'react-native';
import { CalendarProvider } from '../context/CalendarContext';
import { LeadProvider } from '../context/LeadContext';
import { NotificationProvider } from '../context/NotificationContext';

import { AppDarkTheme, AppLightTheme } from '@/hooks/use-color-scheme';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold
} from '@expo-google-fonts/poppins';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from '../components/Toast';
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Poppins': Poppins_400Regular,
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

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
                  <Stack.Screen name="index" options={{ headerShown: false }} />
                  <Stack.Screen name="AdvocateProfile" options={{ headerShown: false }} />
                  <Stack.Screen name="Calendar" options={{ headerShown: false }} />
                  <Stack.Screen name="Privacy" options={{ headerShown: false }} />
                  <Stack.Screen name="Reset" options={{ headerShown: false }} />
                  <Stack.Screen name="support" options={{ headerShown: false }} />
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
                  <Stack.Screen name="LeadDetails" options={{ headerShown: false }} />
                </Stack>
                <StatusBar style="auto" />
                <Toast />
              </ThemeProvider>
            </CalendarProvider>
          </LeadProvider>
        </NotificationProvider>
      </SafeAreaProvider>
    </KeyboardProvider>
  );
}
