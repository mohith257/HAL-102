import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

export default function CameraFeedScreen() {
    const navigation = useNavigation();
    const [isConnecting, setIsConnecting] = useState(true);

    useEffect(() => {
        // Simulate connection delay to hardware glasses
        const timer = setTimeout(() => {
            setIsConnecting(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#FFF" />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
                <View style={styles.liveIndicator}>
                    <View style={styles.liveDot} />
                    <Text style={styles.liveText}>LIVE STREAM</Text>
                </View>
            </View>

            <View style={styles.videoContainer}>
                {isConnecting ? (
                    <View style={styles.centerContent}>
                        <ActivityIndicator size="large" color="#FF3B30" />
                        <Text style={styles.loadingText}>Connecting to VisionMate Camera...</Text>
                        <Text style={styles.subLoadingText}>Establishing secure P2P connection</Text>
                    </View>
                ) : (
                    <View style={styles.centerContent}>
                        <Ionicons name="videocam-off-outline" size={64} color="#8E8E93" />
                        <Text style={styles.placeholderText}>No Active Hardware Feed</Text>
                        <Text style={styles.subPlaceholderText}>The physical glasses are not transmitting video yet.</Text>
                    </View>
                )}
            </View>

            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.bottomOverlay}
            >
                <View style={styles.controls}>
                    <TouchableOpacity style={styles.controlIcon}>
                        <Ionicons name="mic-outline" size={32} color="#FFF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.controlIconMain}>
                        <Ionicons name="call" size={36} color="#FFF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.controlIcon}>
                        <Ionicons name="volume-high-outline" size={32} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#000', // Black background for video feel
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 10,
        zIndex: 10,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backText: {
        color: '#FFF',
        fontSize: 17,
        marginLeft: 4,
    },
    liveIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 59, 48, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 59, 48, 0.5)',
    },
    liveDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FF3B30',
        marginRight: 6,
    },
    liveText: {
        color: '#FF3B30',
        fontWeight: '700',
        fontSize: 12,
        letterSpacing: 0.5,
    },
    videoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerContent: {
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    loadingText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '600',
        marginTop: 20,
        textAlign: 'center',
    },
    subLoadingText: {
        color: '#8E8E93',
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
    },
    placeholderText: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: '600',
        marginTop: 20,
        textAlign: 'center',
    },
    subPlaceholderText: {
        color: '#8E8E93',
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
        lineHeight: 20,
    },
    bottomOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 150,
        justifyContent: 'flex-end',
        paddingBottom: 40,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    controlIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    controlIconMain: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FF3B30',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
