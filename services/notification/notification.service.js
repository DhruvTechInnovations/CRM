// ── ALL FIREBASE CODE COMMENTED OUT – Using OneSignal instead ──────────────────
// To revert: uncomment everything below and restore Firebase deps in package.json & app.json

// import messaging from '@react-native-firebase/messaging';
// import * as SecureStore from 'expo-secure-store';
// import { PermissionsAndroid, Platform } from 'react-native';
// import { privateApi } from '../privateapi';
//
//
//
//
// const FCM_TOKEN_KEY = 'fcmToken';
// export async function initNotifications() {
//     // Android 13+ permission
//     if (Platform.OS === 'android') {
//         await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
//         );
//     }
//
//     const authStatus = await messaging().requestPermission();
//
//     const enabled =
//         authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//         authStatus === messaging.AuthorizationStatus.PROVISIONAL;
//
//     if (!enabled) {
//         console.warn('[FCM] Permission not granted');
//         return null;
//     }
//
//     const token = await messaging().getToken();
//
//     console.log('[FCM TOKEN]', token);
//     await SecureStore.setItemAsync(FCM_TOKEN_KEY, token);
//
//     // await saveToken(token);
//
//
//     // messaging().onTokenRefresh(async (newToken) => {
//     //     console.log('[FCM TOKEN REFRESHED]', newToken);
//     //     await SecureStore.setItemAsync(FCM_TOKEN_KEY, newToken);
//     //     // await saveToken(newToken);
//     // });
//
//
//
//     messaging().onTokenRefresh(async (newToken) => {
//         await SecureStore.setItemAsync(FCM_TOKEN_KEY, newToken);
//
//         const userToken = await SecureStore.getItemAsync('userToken');
//
//         if (userToken) {
//             await privateApi.post('/fcm-token', {
//                 token: newToken,
//                 platform: Platform.OS,
//             });
//         }
//     });
//
//
//     return token;
// }
//
// async function saveToken(token) {
//     if (!token) return;
//
//     try {
//         await privateApi.post('/fcm-token', {
//             token,
//             platform: Platform.OS,
//         });
//     } catch (err) {
//         console.warn('Failed to save token', err?.message);
//     }
// }