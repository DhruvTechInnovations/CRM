// /**
//  * NotificationTestScreen.tsx
//  * ─────────────────────────────────────────────────────
//  * TEMPORARY TEST SCREEN — remove from production
//  * ─────────────────────────────────────────────────────
//  * How to reach it: add a route or call router.push('/NotificationTest')
//  */

// import * as Clipboard from 'expo-clipboard';
// import { router } from 'expo-router';
// import { AlertCircle, Bell, CheckCircle2, ChevronLeft, Copy, Info, Zap } from 'lucide-react-native';
// import { useState } from 'react';
// import {
//     Alert,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
// } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useNotification } from '../context/NotificationContext';

// export default function NotificationTestScreen() {
//     const { showNotification, pushToken } = useNotification();
//     const insets = useSafeAreaInsets();

//     const copyToken = async () => {
//         if (!pushToken) {
//             Alert.alert('No token', 'Push token not yet registered. Make sure you\'re on a physical device with a development build.');
//             return;
//         }
//         await Clipboard.setStringAsync(pushToken);
//         Alert.alert('Copied!', 'Push token copied to clipboard.');
//     };

//     const testInApp = (type: 'info' | 'success' | 'error' | 'warning' | 'push') => {
//         const messages: Record<string, { title: string; body: string }> = {
//             info:    { title: 'Info',    body: 'This is an informational message.' },
//             success: { title: 'Success', body: 'Lead status updated successfully!' },
//             error:   { title: 'Error',   body: 'Failed to sync data. Please retry.' },
//             warning: { title: 'Warning', body: 'Your session will expire in 5 minutes.' },
//             push:    { title: 'New Lead 🎉', body: 'Rajesh Kumar submitted a new inquiry.' },
//         };
//         const { title, body } = messages[type];
//         showNotification(body, type, 4000, title, type === 'push' ? () => router.push('/(tabs)/Dashboard') : null);
//     };

//     return (
//         <View style={[styles.root, { paddingTop: insets.top }]}>
//             {/* Header */}
//             <View style={styles.header}>
//                 <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
//                     <ChevronLeft size={22} color="#1e3a5f" />
//                 </TouchableOpacity>
//                 <Text style={styles.headerTitle}>Notification Tester</Text>
//             </View>

//             <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

//                 {/* Push Token */}
//                 <View style={styles.card}>
//                     <Text style={styles.sectionTitle}>📋 Your FCM / Expo Push Token</Text>
//                     <Text style={styles.tokenText} numberOfLines={3} selectable>
//                         {pushToken ?? '⚠️  Not registered yet\n(Physical device + dev build required)'}
//                     </Text>
//                     <TouchableOpacity style={styles.copyBtn} onPress={copyToken}>
//                         <Copy size={16} color="#fff" />
//                         <Text style={styles.copyBtnText}>Copy Token</Text>
//                     </TouchableOpacity>
//                 </View>

//                 {/* In-App Banners */}
//                 <View style={styles.card}>
//                     <Text style={styles.sectionTitle}>🎨 In-App Banner Types</Text>
//                     <Text style={styles.hint}>Tap a button → banner appears at top of screen</Text>

//                     {[
//                         { type: 'info',    label: 'Info',    Icon: Info,         color: '#3b82f6' },
//                         { type: 'success', label: 'Success', Icon: CheckCircle2, color: '#10b981' },
//                         { type: 'error',   label: 'Error',   Icon: AlertCircle,  color: '#ef4444' },
//                         { type: 'warning', label: 'Warning', Icon: Zap,          color: '#f59e0b' },
//                         { type: 'push',    label: 'Push Style (tappable)', Icon: Bell, color: '#1e3a5f' },
//                     ].map(({ type, label, Icon, color }) => (
//                         <TouchableOpacity
//                             key={type}
//                             style={[styles.testBtn, { borderColor: color }]}
//                             onPress={() => testInApp(type as any)}
//                         >
//                             <Icon size={18} color={color} />
//                             <Text style={[styles.testBtnText, { color }]}>{label}</Text>
//                         </TouchableOpacity>
//                     ))}
//                 </View>

//                 {/* Firebase Console Instructions */}
//                 <View style={styles.card}>
//                     <Text style={styles.sectionTitle}>🔥 Test Real FCM Push</Text>
//                     <Text style={styles.hint}>Steps to send from Firebase Console:</Text>
//                     {[
//                         '1. Copy your token above',
//                         '2. Go to console.firebase.google.com',
//                         '3. Select project: android-app-133e2',
//                         '4. Click "Run" → Cloud Messaging',
//                         '5. Click "Send your first message"',
//                         '6. Enter title & body, click Next',
//                         '7. Target → "FCM registration token"',
//                         '8. Paste your token → Send!',
//                     ].map((step) => (
//                         <Text key={step} style={styles.step}>{step}</Text>
//                     ))}
//                 </View>

//             </ScrollView>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     root: { flex: 1, backgroundColor: '#f8fafc' },
//     header: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingHorizontal: 16,
//         paddingVertical: 12,
//         backgroundColor: '#fff',
//         borderBottomWidth: 1,
//         borderBottomColor: '#e5e7eb',
//     },
//     backBtn: { padding: 4, marginRight: 8 },
//     headerTitle: {
//         fontSize: 17,
//         fontFamily: 'Poppins-SemiBold',
//         color: '#1e3a5f',
//     },
//     scroll: { padding: 16, gap: 16, paddingBottom: 40 },
//     card: {
//         backgroundColor: '#fff',
//         borderRadius: 16,
//         padding: 16,
//         gap: 10,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.06,
//         shadowRadius: 8,
//         elevation: 3,
//     },
//     sectionTitle: {
//         fontSize: 15,
//         fontFamily: 'Poppins-SemiBold',
//         color: '#1e3a5f',
//         marginBottom: 2,
//     },
//     hint: {
//         fontSize: 12,
//         fontFamily: 'Poppins-Regular',
//         color: '#6b7280',
//         marginBottom: 4,
//     },
//     tokenText: {
//         fontSize: 11,
//         fontFamily: 'Poppins-Regular',
//         color: '#374151',
//         backgroundColor: '#f1f5f9',
//         padding: 10,
//         borderRadius: 8,
//         lineHeight: 16,
//     },
//     copyBtn: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 6,
//         backgroundColor: '#1e3a5f',
//         paddingVertical: 10,
//         paddingHorizontal: 16,
//         borderRadius: 10,
//         alignSelf: 'flex-start',
//     },
//     copyBtnText: { color: '#fff', fontSize: 13, fontFamily: 'Poppins-Medium' },
//     testBtn: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 10,
//         borderWidth: 1.5,
//         borderRadius: 10,
//         paddingVertical: 12,
//         paddingHorizontal: 14,
//     },
//     testBtnText: { fontSize: 14, fontFamily: 'Poppins-Medium' },
//     scheduledInfo: {
//         backgroundColor: '#f0fdf4',
//         borderRadius: 8,
//         padding: 10,
//         borderWidth: 1,
//         borderColor: '#bbf7d0',
//     },
//     scheduledText: { fontSize: 13, fontFamily: 'Poppins-Regular', color: '#166534' },
//     step: {
//         fontSize: 13,
//         fontFamily: 'Poppins-Regular',
//         color: '#374151',
//         lineHeight: 22,
//     },
// });
