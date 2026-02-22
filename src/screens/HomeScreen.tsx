import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert, Animated, Vibration } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BACKEND_URL, NOTIFICATION_POLL_INTERVAL } from '../config';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
    const [userName, setUserName] = useState<string | null>('');
    const [blindName, setBlindName] = useState<string | null>('');
    const [blindPhone, setBlindPhone] = useState<string | null>('');
    const [isBackendConnected, setIsBackendConnected] = useState(false);
    const [bannerNotif, setBannerNotif] = useState<{ title: string; message: string } | null>(null);
    const bannerAnim = useRef(new Animated.Value(-120)).current;
    const navigation = useNavigation<NavigationProp>();
    const notifPollRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Show in-app notification banner
    const showBanner = (title: string, message: string) => {
        setBannerNotif({ title, message });
        Vibration.vibrate(400);
        Animated.sequence([
            Animated.spring(bannerAnim, { toValue: 0, useNativeDriver: true, speed: 12 }),
            Animated.delay(4000),
            Animated.timing(bannerAnim, { toValue: -120, duration: 300, useNativeDriver: true }),
        ]).start(() => setBannerNotif(null));
    };

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const name = await AsyncStorage.getItem('userName');
                const pName = await AsyncStorage.getItem('blindName');
                const pPhone = await AsyncStorage.getItem('userPhone');

                if (name) setUserName(name);
                if (pName) setBlindName(pName);
                if (pPhone) setBlindPhone(pPhone);
            } catch (e) {
                console.error('Failed to load user data', e);
            }
        };

        loadUserData();
    }, []);

    // Poll the backend for notifications (in-app banners, no expo-notifications needed)
    useEffect(() => {
        const pollNotifications = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/api/notifications`);
                const data = await response.json();
                setIsBackendConnected(true);

                if (data.notifications && data.notifications.length > 0) {
                    for (const notif of data.notifications) {
                        showBanner(
                            notif.title || '\u{1F6A8} VisionMate Alert',
                            notif.message
                        );
                    }
                }
            } catch (e) {
                setIsBackendConnected(false);
            }
        };

        // First poll immediately
        pollNotifications();

        // Then poll on interval
        notifPollRef.current = setInterval(pollNotifications, NOTIFICATION_POLL_INTERVAL);
        return () => {
            if (notifPollRef.current) clearInterval(notifPollRef.current);
        };
    }, []);

    const handleCall = () => {
        if (!blindPhone) {
            Alert.alert("Error", "No phone number available to call.");
            return;
        }
        Linking.openURL(`tel:${blindPhone}`);
    };

    // Removed simulation notification logic

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* In-App Notification Banner */}
            {bannerNotif && (
                <Animated.View style={[styles.notifBanner, { transform: [{ translateY: bannerAnim }] }]}>
                    <View style={styles.notifIcon}>
                        <Ionicons name="warning" size={24} color="#FFF" />
                    </View>
                    <View style={styles.notifTextContainer}>
                        <Text style={styles.notifTitle}>{bannerNotif.title}</Text>
                        <Text style={styles.notifMessage} numberOfLines={2}>{bannerNotif.message}</Text>
                    </View>
                </Animated.View>
            )}

            <View style={styles.container}>
                {/* Header Section */}
                <View style={styles.header}>
                    <Text style={styles.greeting}>Hello, {userName}</Text>
                    <View style={styles.statusBadge}>
                        <View style={[styles.statusDot, { backgroundColor: isBackendConnected ? '#34C759' : '#FF9500' }]} />
                        <Text style={styles.statusText}>
                            {isBackendConnected
                                ? `Connected to ${blindName}'s VisionMate`
                                : 'Connecting to VisionMate...'}
                        </Text>
                    </View>
                </View>

                {/* Primary Actions Grid */}
                <View style={styles.actionsContainer}>
                    <TouchableOpacity
                        style={[styles.actionCard, styles.mapCard]}
                        onPress={() => navigation.navigate('Map')}
                        activeOpacity={0.8}
                    >
                        <View style={styles.iconCircleMap}>
                            <Ionicons name="map" size={32} color="#007AFF" />
                        </View>
                        <Text style={styles.actionTitle}>View Location</Text>
                        <Text style={styles.actionSubtitle}>See live map status</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionCard, styles.callCard]}
                        onPress={handleCall}
                        activeOpacity={0.8}
                    >
                        <View style={styles.iconCircleCall}>
                            <Ionicons name="call" size={32} color="#34C759" />
                        </View>
                        <Text style={styles.actionTitle}>Call Direct</Text>
                        <Text style={styles.actionSubtitle}>Connect instantly</Text>
                    </TouchableOpacity>
                </View>

                {/* SOS Camera Feature */}
                <View style={styles.sosContainer}>
                    <Text style={styles.sosHeader}>Emergency Tools</Text>
                    <TouchableOpacity
                        style={styles.sosButton}
                        onPress={() => navigation.navigate('CameraFeed')}
                        activeOpacity={0.9}
                    >
                        <LinearGradient
                            colors={['#FF3B30', '#D70015']}
                            style={styles.sosGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Ionicons name="videocam" size={28} color="#FFF" style={styles.sosIcon} />
                            <View style={styles.sosTextContainer}>
                                <Text style={styles.sosTitle}>Access Camera Feed</Text>
                                <Text style={styles.sosSubtitle}>Live view during SOS alerts</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={24} color="rgba(255,255,255,0.7)" />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>



                {/* Settings Gear */}
                <TouchableOpacity style={styles.settingsButton}>
                    <Ionicons name="cog-outline" size={28} color="#8E8E93" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F2F2F7',
    },
    container: {
        flex: 1,
        padding: 24,
    },
    header: {
        marginTop: 20,
        marginBottom: 40,
    },
    greeting: {
        fontSize: 34,
        fontWeight: '800',
        color: '#1C1C1E',
        marginBottom: 8,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E5F1FF',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#34C759',
        marginRight: 8,
    },
    statusText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#007AFF',
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    actionCard: {
        backgroundColor: '#FFF',
        width: '47%',
        padding: 24,
        borderRadius: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 16,
        elevation: 6,
    },
    mapCard: {
    },
    callCard: {
    },
    iconCircleMap: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#E5F1FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconCircleCall: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#E8F8F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    actionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1C1C1E',
        marginBottom: 4,
    },
    actionSubtitle: {
        fontSize: 12,
        color: '#8E8E93',
        textAlign: 'center',
    },
    sosContainer: {
        marginTop: 10,
    },
    sosHeader: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1C1C1E',
        marginBottom: 16,
    },
    sosButton: {
        shadowColor: '#FF3B30',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    sosGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 24,
        borderRadius: 24,
    },
    sosIcon: {
        marginRight: 16,
    },
    sosTextContainer: {
        flex: 1,
    },
    sosTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFF',
        marginBottom: 4,
    },
    sosSubtitle: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.8)',
    },
    settingsButton: {
        position: 'absolute',
        top: 24,
        right: 24,
        padding: 8,
    },
    notifBanner: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: '#FF3B30',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 16,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 20,
    },
    notifIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.25)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    notifTextContainer: {
        flex: 1,
    },
    notifTitle: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '700',
    },
    notifMessage: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 13,
        marginTop: 2,
    },
});
