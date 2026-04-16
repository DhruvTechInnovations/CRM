import messaging from '@react-native-firebase/messaging';

/**
 * Handle navigation when notification is clicked
 */
export function setupNotificationNavigation(navigation) {

    // App opened from background
    messaging().onNotificationOpenedApp(remoteMessage => {
        handleNavigation(remoteMessage, navigation);
    });

    // App opened from killed state
    messaging()
        .getInitialNotification()
        .then(remoteMessage => {
            if (remoteMessage) {
                handleNavigation(remoteMessage, navigation);
            }
        });
}

function handleNavigation(remoteMessage, navigation) {
    const screen = remoteMessage?.data?.screen;

    if (screen) {
        navigation.navigate(screen, remoteMessage.data);
    }
}