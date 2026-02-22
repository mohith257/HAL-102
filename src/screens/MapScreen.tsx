import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_DEFAULT, Region } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BACKEND_URL, LOCATION_POLL_INTERVAL } from '../config';

export default function MapScreen() {
    const [userName, setUserName] = useState<string | null>(null);
    const [blindName, setBlindName] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const navigation = useNavigation();

    // Live location from laptop backend
    const [glassesLocation, setGlassesLocation] = useState({
        latitude: 12.926516,
        longitude: 77.526422,
    });

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const name = await AsyncStorage.getItem('userName');
                const blindPerson = await AsyncStorage.getItem('blindName');
                if (name) setUserName(name);
                if (blindPerson) setBlindName(blindPerson);
            } catch (e) {
                console.error('Failed to load user data', e);
            }
        };

        loadUserData();

        // Poll location from backend every 3 seconds
        const pollLocation = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/api/location`);
                const data = await response.json();
                if (data.latitude && data.longitude) {
                    setGlassesLocation({
                        latitude: data.latitude,
                        longitude: data.longitude,
                    });
                    setIsConnected(true);
                }
            } catch (e) {
                console.log('Location poll failed:', e);
                setIsConnected(false);
            }
        };

        // Initial fetch
        pollLocation();
        const interval = setInterval(pollLocation, LOCATION_POLL_INTERVAL);

        return () => clearInterval(interval);
    }, []);

    const triggerEmergencyAlert = async () => {
        // This simulates the direct signal coming from the connected glasses button press
        const patientName = blindName ? blindName : "The VisionMate user";

        // 1. Send Local Notification
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "🚨 EMERGENCY ALERT",
                body: `${patientName} is in danger! Emergency triggered from their VisionMate Glasses. Please contact them immediately!`,
                sound: 'default',
                priority: Notifications.AndroidNotificationPriority.MAX,
            },
            trigger: null, // null means trigger immediately
        });

        // 2. Fallback visual alert in-app
        Alert.alert(
            "Emergency Signal Sent",
            "A high-priority notification was successfully dispatched to your device simulating a glasses hardware press.",
            [{ text: "OK", style: "default" }]
        );
    };

    const currentRegion: Region = {
        latitude: glassesLocation.latitude,
        longitude: glassesLocation.longitude,
        latitudeDelta: 0.05, // A bit more zoomed out for a dummy view
        longitudeDelta: 0.05,
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                provider={PROVIDER_DEFAULT}
                region={currentRegion}
            >
                <Marker
                    coordinate={{
                        latitude: glassesLocation.latitude,
                        longitude: glassesLocation.longitude
                    }}
                >
                    <View style={styles.customMarker}>
                        <Ionicons name="glasses" size={24} color="#FFF" />
                    </View>
                </Marker>
            </MapView>

            <SafeAreaView style={styles.overlayContainer} pointerEvents="box-none">
                {/* Floating Glassmorphic Header */}
                {userName ? (
                    <View style={styles.floatingHeader}>
                        <View style={styles.headerLeft}>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                                <Ionicons name="chevron-back" size={28} color="#007AFF" />
                            </TouchableOpacity>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>{userName.charAt(0)}</Text>
                            </View>
                            <View>
                                <Text style={styles.headerText}>Hello, {userName}</Text>
                                <View style={styles.statusBadge}>
                                    <View style={[styles.statusDot, { backgroundColor: isConnected ? '#34C759' : '#FF3B30' }]} />
                                    <Text style={styles.subHeaderText}>
                                        {isConnected ? `Tracking ${blindName ? blindName : "Glasses"}` : "Connecting..."}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.iconButton}>
                            <Ionicons name="settings-outline" size={24} color="#1C1C1E" />
                        </TouchableOpacity>
                    </View>
                ) : null}

                {/* Floating Action Buttons Matrix Bottom */}
                <View style={styles.floatingActionsBottom} pointerEvents="box-none">
                    <TouchableOpacity
                        style={styles.primaryActionButton}
                        onPress={triggerEmergencyAlert}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="alert" size={32} color="#FFF" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.secondaryActionButton}>
                        <Ionicons name="navigate-outline" size={24} color="#1C1C1E" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    overlayContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    floatingHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        marginHorizontal: 16,
        marginTop: Platform.OS === 'android' ? 40 : 16,
        padding: 16,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 8,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 8,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#E5F1FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    headerText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1C1C1E',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#34C759', // Green
        marginRight: 6,
    },
    subHeaderText: {
        fontSize: 13,
        color: '#8E8E93',
        fontWeight: '500',
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F2F2F7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    customMarker: {
        backgroundColor: '#007AFF',
        width: 46,
        height: 46,
        borderRadius: 23,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
    },
    floatingActionsBottom: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        paddingHorizontal: 16,
        paddingBottom: Platform.OS === 'ios' ? 16 : 32,
    },
    primaryActionButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    secondaryActionButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
});
