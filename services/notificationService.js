// import messaging from '@react-native-firebase/messaging';
// import { Platform } from 'react-native';
// import { privateApi } from './privateapi';

// // ─── Request permissions & get FCM push token ────────────────────────────────
// export async function registerForPushNotificationsAsync() {
//     // On Android APIs >= 13, this prompts the user for notification permissions.
//     // On older Androids, this instantly returns AUTHORIZED natively.
//     const authStatus = await messaging().requestPermission();
    
//     const enabled =
//         authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//         authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//     if (!enabled) {
//         console.warn('[Firebase] Notification permission not granted.');
//         return null;
//     }

//     try {
//         const token = await messaging().getToken();
//         console.log('[Firebase] Push token:', token);
//         return token;
//     } catch (err) {
//         console.error('[Firebase] Failed to get push token:', err);
//         return null;
//     }
// }

// // ─── Save FCM token to backend ────────────────────────────────────────────────
// export async function savePushTokenToBackend(token) {
//     if (!token) return;
//     try {
//         await privateApi.post('/fcm-token', { token, platform: Platform.OS });
//         console.log('[Firebase] Token saved to backend.');
//     } catch (err) {
//         console.warn('[Firebase] Could not save token to backend:', err?.message);
//     }
// }

// // ─── Background Notification Handler ────────────────────────────────────────
// // This must be registered early outside of any component lifecycle
// // It handles silent data payloads when the app is in the background or killed.
// messaging().setBackgroundMessageHandler(async remoteMessage => {
//     console.log('[Firebase] Message handled in the background!', remoteMessage);
// });
