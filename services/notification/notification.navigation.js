// ── ALL FIREBASE CODE COMMENTED OUT – Using OneSignal instead ──────────────────
// To revert: uncomment everything below

// import messaging from '@react-native-firebase/messaging';
// import { router } from "expo-router";
//
// /**
//  * Handle navigation when notification is clicked
//  */
// export function setupNotificationNavigation() {
//     // App opened from background
//     messaging().onNotificationOpenedApp(remoteMessage => {
//         handleNavigation(remoteMessage, navigation);
//     });
//
//     // App opened from killed state
//     messaging()
//         .getInitialNotification()
//         .then(remoteMessage => {
//             if (remoteMessage) {
//                 handleNavigation(remoteMessage, navigation);
//             }
//         });
// }
//
// function handleNavigation(remoteMessage, navigation) {
//     const screen = remoteMessage?.data?.screen;
//     if (!screen) {
//         return null;
//     }
//
//     if (screen) {
//         router.push(screen);
//     }
// }