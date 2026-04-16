// import { AlertCircle, Bell, CheckCircle2, Info, X } from 'lucide-react-native';
// import { useEffect, useRef } from 'react';
// import {
//     Animated,
//     PanResponder,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
// } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useNotification, type NotificationItem } from '../context/NotificationContext';

// const THEME = {
//     success: { bg: '#ecfdf5', border: '#10b981', text: '#065f46', icon: '#059669' },
//     error:   { bg: '#fef2f2', border: '#ef4444', text: '#7f1d1d', icon: '#dc2626' },
//     info:    { bg: '#eff6ff', border: '#3b82f6', text: '#1e3a5f', icon: '#3b82f6' },
//     push:    { bg: '#1e3a5f', border: '#2d5986', text: '#ffffff', icon: '#93c5fd' },
//     warning: { bg: '#fffbeb', border: '#f59e0b', text: '#78350f', icon: '#d97706' },
// };

// const Toast = () => {
//     // useNotification() always returns a typed value — never null inside NotificationProvider
//     const { notification, hideNotification } = useNotification();
//     const insets = useSafeAreaInsets();

//     const translateY = useRef(new Animated.Value(-120)).current;
//     const opacity    = useRef(new Animated.Value(0)).current;
//     const pan        = useRef(new Animated.Value(0)).current;

//     // ── Slide in / out ────────────────────────────────────────────────────────
//     useEffect(() => {
//         if (notification) {
//             pan.setValue(0);
//             Animated.parallel([
//                 Animated.spring(translateY, {
//                     toValue: 0,
//                     useNativeDriver: true,
//                     tension: 60,
//                     friction: 10,
//                 }),
//                 Animated.timing(opacity, {
//                     toValue: 1,
//                     duration: 220,
//                     useNativeDriver: true,
//                 }),
//             ]).start();
//         } else {
//             Animated.parallel([
//                 Animated.timing(translateY, {
//                     toValue: -120,
//                     duration: 280,
//                     useNativeDriver: true,
//                 }),
//                 Animated.timing(opacity, {
//                     toValue: 0,
//                     duration: 200,
//                     useNativeDriver: true,
//                 }),
//             ]).start();
//         }
//     }, [notification]);

//     // ── Swipe up to dismiss ───────────────────────────────────────────────────
//     const panResponder = useRef(
//         PanResponder.create({
//             onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 5,
//             onPanResponderMove: (_, g) => {
//                 if (g.dy < 0) pan.setValue(g.dy);
//             },
//             onPanResponderRelease: (_, g) => {
//                 if (g.dy < -40) {
//                     hideNotification();
//                 } else {
//                     Animated.spring(pan, { toValue: 0, useNativeDriver: true }).start();
//                 }
//             },
//         }),
//     ).current;

//     if (!notification) return null;

//     const type   = notification.type ?? 'info';
//     const colors = THEME[type] ?? THEME.info;
//     const isPush = type === 'push';

//     const getIcon = () => {
//         const size  = 22;
//         const color = colors.icon;
//         switch (type) {
//             case 'success': return <CheckCircle2 size={size} color={color} />;
//             case 'error':   return <AlertCircle  size={size} color={color} />;
//             case 'push':    return <Bell         size={size} color={color} />;
//             default:        return <Info         size={size} color={color} />;
//         }
//     };

//     return (
//         <Animated.View
//             style={[
//                 styles.wrapper,
//                 {
//                     top: insets.top + 12,
//                     transform: [
//                         { translateY: Animated.add(translateY, pan) },
//                     ],
//                     opacity,
//                 },
//             ]}
//             {...panResponder.panHandlers}
//         >
//             <TouchableOpacity
//                 activeOpacity={notification.onPress ? 0.85 : 1}
//                 onPress={() => {
//                     if (notification.onPress) {
//                         hideNotification();
//                         notification.onPress();
//                     }
//                 }}
//                 style={[
//                     styles.container,
//                     {
//                         backgroundColor: colors.bg,
//                         borderColor: colors.border,
//                         shadowColor: isPush ? '#1e3a5f' : '#000',
//                     },
//                 ]}
//             >
//                 {/* Left accent bar */}
//                 <View style={[styles.accentBar, { backgroundColor: colors.border }]} />

//                 <View style={styles.iconWrap}>{getIcon()}</View>

//                 <View style={styles.textWrap}>
//                     {notification.title && (
//                         <Text
//                             style={[styles.title, { color: colors.text }]}
//                             numberOfLines={1}
//                         >
//                             {notification.title}
//                         </Text>
//                     )}
//                     <Text
//                         style={[
//                             styles.message,
//                             { color: isPush ? 'rgba(255,255,255,0.85)' : '#374151' },
//                             !notification.title && styles.messageAlone,
//                         ]}
//                         numberOfLines={2}
//                     >
//                         {notification.message}
//                     </Text>
//                 </View>

//                 <TouchableOpacity onPress={hideNotification} style={styles.closeButton} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
//                     <X size={16} color={isPush ? 'rgba(255,255,255,0.7)' : '#9ca3af'} />
//                 </TouchableOpacity>
//             </TouchableOpacity>

//             {/* Swipe hint pill */}
//             <View style={styles.pill} />
//         </Animated.View>
//     );
// };

// const styles = StyleSheet.create({
//     wrapper: {
//         position: 'absolute',
//         left: 16,
//         right: 16,
//         zIndex: 9999,
//         alignItems: 'center',
//     },
//     container: {
//         width: '100%',
//         flexDirection: 'row',
//         alignItems: 'center',
//         borderRadius: 14,
//         borderWidth: 1,
//         overflow: 'hidden',
//         shadowOffset: { width: 0, height: 6 },
//         shadowOpacity: 0.18,
//         shadowRadius: 12,
//         elevation: 12,
//         minHeight: 56,
//     },
//     accentBar: {
//         width: 4,
//         alignSelf: 'stretch',
//     },
//     iconWrap: {
//         paddingHorizontal: 12,
//         paddingVertical: 14,
//     },
//     textWrap: {
//         flex: 1,
//         paddingVertical: 12,
//         paddingRight: 4,
//     },
//     title: {
//         fontSize: 13,
//         fontFamily: 'Poppins-SemiBold',
//         fontWeight: '700',
//         marginBottom: 2,
//     },
//     message: {
//         fontSize: 13,
//         fontFamily: 'Poppins-Regular',
//         lineHeight: 18,
//     },
//     messageAlone: {
//         fontFamily: 'Poppins-Medium',
//         fontWeight: '600',
//         fontSize: 13,
//     },
//     closeButton: {
//         paddingHorizontal: 12,
//         paddingVertical: 14,
//     },
//     pill: {
//         marginTop: 6,
//         width: 36,
//         height: 4,
//         borderRadius: 2,
//         backgroundColor: 'rgba(0,0,0,0.12)',
//     },
// });

// export default Toast;
