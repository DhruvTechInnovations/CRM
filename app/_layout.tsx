
import { AuthProvider } from "@/context/Authcontext";
import { useEffect } from "react";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { LogLevel, OneSignal } from 'react-native-onesignal';
import { AppNavigator } from "./AppNavigator";
export default function RootLayout() {
  // useEffect(() => {
  //   initNotifications().catch((e: any) =>
  //     console.warn('[FCM] initNotifications failed (non-fatal):', e?.message)
  //   );
  //   setupNotificationNavigation();
  //   listenForegroundNotifications((msg: any) => {
  //     console.log('[FCM FOREGROUND]', msg);
  //   });
  // }, []);
  useEffect(() => {
    // Enable verbose logging for debugging (remove in production)
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);

    // Replace with your OneSignal App ID from Dashboard > Settings > Keys & IDs
    OneSignal.initialize('2449c806-56bb-4136-b7fd-ef4848fec147');

    // Prompt for push permission on first launch.
    // In production, consider using an in-app mssage instead for better opt-in rates.
    OneSignal.Notifications.requestPermission(true);
    OneSignal.User.getOnesignalId().then((id) => {
      console.log('OneSignal ID:', id);
    });
  }, []);
  return (
    <KeyboardProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </KeyboardProvider>
  );
}


