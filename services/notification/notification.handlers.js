// ── ALL FIREBASE CODE COMMENTED OUT – Using OneSignal instead ──────────────────
// To revert: uncomment everything below

// import messaging from '@react-native-firebase/messaging';
//
//
// /**
//  * Foreground notifications
//  */
// export function listenForegroundNotifications(onReceive) {
//     return messaging().onMessage(async remoteMessage => {
//         console.log('[FCM FOREGROUND]', remoteMessage);
//         Alert.alert(
//             remoteMessage.notification?.title ?? 'New Notification',
//             remoteMessage.notification?.body ?? '',
//         );
//         onReceive?.(remoteMessage);
//
//     });
// }