
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react-native';
import { useEffect } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNotification } from '../context/NotificationContext';

const Toast = () => {
    const context = useNotification();
    if (!context) return null;
    const { notification, hideNotification } = context;
    const translateY = new Animated.Value(-100);

    useEffect(() => {
        if (notification) {
            Animated.spring(translateY, {
                toValue: 50,
                // @ts-ignore - Animated.spring types can be tricky with friction/tension
                useNativeDriver: true,
                tension: 20,
                friction: 7,
            }).start();
        } else {
            Animated.timing(translateY, {
                toValue: -100,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [notification]);

    if (!notification) return null;

    const getIcon = () => {
        switch (notification) {
            case 'success': return <CheckCircle2 size={20} color="#059669" />;
            case 'error': return <AlertCircle size={20} color="#dc2626" />;
            default: return <Info size={20} color="#3b82f6" />;
        }
    };

    const getColors = () => {
        switch (notification) {
            case 'success': return { bg: '#ecfdf5', border: '#10b981' };
            case 'error': return { bg: '#fef2f2', border: '#ef4444' };
            default: return { bg: '#eff6ff', border: '#3b82f6' };
        }
    };

    const colors = getColors();

    return (
        <Animated.View style={[
            styles.container,
            { transform: [{ translateY }], backgroundColor: colors.bg, borderColor: colors.border }
        ]}>
            <View style={styles.content}>
                {getIcon()}
                <Text style={styles.message}>{notification.message}</Text>
                <TouchableOpacity onPress={hideNotification} style={styles.closeButton}>
                    <X size={16} color="#6b7280" />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 20,
        right: 20,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        zIndex: 9999,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    message: {
        flex: 1,
        fontSize: 14,
        fontWeight: '600',
        color: '#1f2937',
    },
    closeButton: {
        padding: 4,
    }
});

export default Toast;
