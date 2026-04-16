import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { router } from 'expo-router';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type NotificationType = 'info' | 'success' | 'error' | 'warning' | 'push';

export interface NotificationItem {
    message: string;
    type: NotificationType;
    title: string | null;
    onPress: (() => void) | null;
}

interface NotificationContextValue {
    notification: NotificationItem | null;

    showNotification: (
        message: string,
        type?: NotificationType,
        duration?: number,
        title?: string | null,
        onPress?: (() => void) | null,
    ) => void;
    hideNotification: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────
// Typed as NotificationContextValue | null — the hook throws if used outside provider
const NotificationContext = createContext<NotificationContextValue | null>(null);

export const useNotification = (): NotificationContextValue => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;  // TypeScript now knows this is NotificationContextValue (never null)
};

// ─── Provider ─────────────────────────────────────────────────────────────────

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    // ── In-app toast state ────────────────────────────────────────────────────
    const [notification, setNotification] = useState<NotificationItem | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ── Push notification state ───────────────────────────────────────────────
    const [pushToken, setPushToken] = useState<string | null>(null);

    // ── In-app toast helpers ──────────────────────────────────────────────────
    const showNotification = useCallback((
        message: string,
        type: NotificationType = 'info',
        duration = 4000,
        title: string | null = null,
        onPress: (() => void) | null = null,
    ) => {
        if (timerRef.current) clearTimeout(timerRef.current);

        setNotification({ message, type, title, onPress });

        timerRef.current = setTimeout(() => {
            setNotification(null);
            timerRef.current = null;
        }, duration);
    }, []);

    const hideNotification = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        setNotification(null);
    }, []);

    // ── Resolve notification tap → navigate ───────────────────────────────────
    const handleNotificationResponse = useCallback(
        (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
            const data = remoteMessage.data ?? {};
            try {
                if (data.screen && typeof data.screen === 'string') {
                    router.push(data.screen as never);
                }
            } catch (e) {
                console.warn('[NotificationContext] Navigation failed:', e);
            }
        },
        [],
    );

    // ── Bootstrap Firebase Push Notifications on mount ────────────────────────────
    useEffect(() => {
        // Register & get toke

        // 1. Foreground listener — intercept and show our custom in-app banner
        const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
            const title = remoteMessage.notification?.title;
            const body = remoteMessage.notification?.body;
            const screen = remoteMessage.data?.screen as string | undefined;

            showNotification(
                body ?? '',
                'push',
                5000,
                title ?? 'JPLegalConnect',
                screen ? () => router.push(screen as never) : null,
            );
        });

        // 2. Background tap listener
        const unsubscribeBackgroundTap = messaging().onNotificationOpenedApp(remoteMessage => {
            handleNotificationResponse(remoteMessage);
        });

        // 3. Quit state tap listener (handled when app completely boots from quit via tap)
        messaging().getInitialNotification().then(remoteMessage => {
            if (remoteMessage) handleNotificationResponse(remoteMessage);
        });

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            unsubscribeForeground();
            unsubscribeBackgroundTap();
        };
    }, []);

    return (
        <NotificationContext.Provider
            value={{ showNotification, hideNotification, notification }}
        >
            {children}
        </NotificationContext.Provider>
    );
};
