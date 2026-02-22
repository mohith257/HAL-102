import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { BACKEND_URL, BACKEND_IP, BACKEND_PORT } from '../config';

export default function CameraFeedScreen() {
    const navigation = useNavigation();
    const [isConnecting, setIsConnecting] = useState(true);
    const [isConnected, setIsConnected] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isSpeakerOn, setIsSpeakerOn] = useState(true);
    const [frameKey, setFrameKey] = useState(Date.now());
    const [fps, setFps] = useState(0);
    const frameTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isActiveRef = useRef(true);
    const frameCountRef = useRef(0);
    const fpsTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        isActiveRef.current = true;

        // Check if the backend video feed is available
        const checkConnection = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/api/status`);
                const data = await response.json();
                if (data.status === 'running') {
                    setIsConnected(true);
                }
            } catch (e) {
                console.log('Backend not reachable:', e);
                setIsConnected(false);
            } finally {
                setIsConnecting(false);
            }
        };

        const timer = setTimeout(checkConnection, 1500);

        // FPS counter
        fpsTimerRef.current = setInterval(() => {
            setFps(frameCountRef.current);
            frameCountRef.current = 0;
        }, 1000);

        return () => {
            isActiveRef.current = false;
            clearTimeout(timer);
            if (frameTimerRef.current) clearTimeout(frameTimerRef.current);
            if (fpsTimerRef.current) clearInterval(fpsTimerRef.current);
        };
    }, []);

    // When a frame loads, schedule the next one
    const onFrameLoad = useCallback(() => {
        frameCountRef.current++;
        if (isActiveRef.current) {
            frameTimerRef.current = setTimeout(() => {
                setFrameKey(Date.now());
            }, 100); // ~10 fps polling
        }
    }, []);

    // If a frame fails, retry after a short delay
    const onFrameError = useCallback(() => {
        if (isActiveRef.current) {
            frameTimerRef.current = setTimeout(() => {
                setFrameKey(Date.now());
            }, 500);
        }
    }, []);

    const handleHangUp = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#FFF" />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
                <View style={[styles.liveIndicator, isConnected && styles.liveIndicatorActive]}>
                    <View style={[styles.liveDot, isConnected && styles.liveDotActive]} />
                    <Text style={[styles.liveText, isConnected && styles.liveTextActive]}>
                        {isConnected ? 'LIVE' : 'OFFLINE'}
                    </Text>
                </View>
            </View>

            <View style={styles.videoContainer}>
                {isConnecting ? (
                    <View style={styles.centerContent}>
                        <ActivityIndicator size="large" color="#FF3B30" />
                        <Text style={styles.loadingText}>Connecting to VisionMate Camera...</Text>
                        <Text style={styles.subLoadingText}>Establishing secure connection</Text>
                    </View>
                ) : isConnected ? (
                    <View style={styles.feedContainer}>
                        <Image
                            key={frameKey}
                            source={{ uri: `${BACKEND_URL}/api/snapshot?t=${frameKey}` }}
                            style={styles.feedImage}
                            resizeMode="cover"
                            onLoad={onFrameLoad}
                            onError={onFrameError}
                        />
                        <View style={styles.fpsCounter}>
                            <Text style={styles.fpsText}>{fps} FPS</Text>
                        </View>
                    </View>
                ) : (
                    <View style={styles.centerContent}>
                        <Ionicons name="videocam-off-outline" size={64} color="#8E8E93" />
                        <Text style={styles.placeholderText}>Cannot Connect to Camera</Text>
                        <Text style={styles.subPlaceholderText}>
                            Make sure the VisionMate backend is running{'\n'}
                            on your laptop ({BACKEND_IP}:{BACKEND_PORT})
                        </Text>
                        <TouchableOpacity
                            style={styles.retryButton}
                            onPress={() => {
                                setIsConnecting(true);
                                setTimeout(async () => {
                                    try {
                                        const resp = await fetch(`${BACKEND_URL}/api/status`);
                                        const data = await resp.json();
                                        if (data.status === 'running') setIsConnected(true);
                                    } catch {}
                                    setIsConnecting(false);
                                }, 1500);
                            }}
                        >
                            <Text style={styles.retryText}>Retry Connection</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.bottomOverlay}
            >
                <View style={styles.controls}>
                    <TouchableOpacity
                        style={[styles.controlIcon, isMuted && styles.controlIconActive]}
                        onPress={() => setIsMuted(!isMuted)}
                    >
                        <Ionicons
                            name={isMuted ? "mic-off" : "mic-outline"}
                            size={32}
                            color="#FFF"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.controlIconMain} onPress={handleHangUp}>
                        <Ionicons name="call" size={36} color="#FFF" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.controlIcon, isSpeakerOn && styles.controlIconActive]}
                        onPress={() => setIsSpeakerOn(!isSpeakerOn)}
                    >
                        <Ionicons
                            name={isSpeakerOn ? "volume-high" : "volume-mute-outline"}
                            size={32}
                            color="#FFF"
                        />
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#000',
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
        backgroundColor: 'rgba(142, 142, 147, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(142, 142, 147, 0.5)',
    },
    liveIndicatorActive: {
        backgroundColor: 'rgba(255, 59, 48, 0.2)',
        borderColor: 'rgba(255, 59, 48, 0.5)',
    },
    liveDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#8E8E93',
        marginRight: 6,
    },
    liveDotActive: {
        backgroundColor: '#FF3B30',
    },
    liveText: {
        color: '#8E8E93',
        fontWeight: '700',
        fontSize: 12,
        letterSpacing: 0.5,
    },
    liveTextActive: {
        color: '#FF3B30',
    },
    videoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    feedContainer: {
        flex: 1,
        width: '100%',
        backgroundColor: '#000',
    },
    feedImage: {
        flex: 1,
        width: '100%',
    },
    fpsCounter: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    fpsText: {
        color: '#34C759',
        fontSize: 11,
        fontWeight: '700',
        fontFamily: 'monospace',
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
    retryButton: {
        marginTop: 24,
        backgroundColor: '#007AFF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    retryText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
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
    controlIconActive: {
        backgroundColor: 'rgba(0, 122, 255, 0.4)',
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
