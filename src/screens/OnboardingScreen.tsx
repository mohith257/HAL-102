import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

export default function OnboardingScreen() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [blindName, setBlindName] = useState('');
    const navigation = useNavigation<NavigationProp>();

    const handleSave = async () => {
        if (!name.trim() || !phone.trim() || !blindName.trim()) {
            Alert.alert('Details Required', 'Please fill out all fields to continue.');
            return;
        }
        try {
            await AsyncStorage.setItem('userName', name);
            await AsyncStorage.setItem('userPhone', phone);
            await AsyncStorage.setItem('blindName', blindName);
            navigation.replace('Home');
        } catch (e) {
            Alert.alert('Error', 'Failed to save data. Please try again.');
        }
    };

    return (
        <LinearGradient colors={['#F2F2F7', '#E5E5EA']} style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        <View style={styles.headerContainer}>
                            <View style={styles.iconCircle}>
                                <Ionicons name="eye" size={40} color="#007AFF" />
                            </View>
                            <Text style={styles.title}>VisionMate</Text>
                            <Text style={styles.subtitle}>Companion tracking setup</Text>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.sectionTitle}>Family Member Info (You)</Text>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Your Name</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons name="person-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="e.g. Jane Doe"
                                        placeholderTextColor="#C7C7CC"
                                        value={name}
                                        onChangeText={setName}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Your Phone Number</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons name="call-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="e.g. +1 234 567 8900"
                                        placeholderTextColor="#C7C7CC"
                                        value={phone}
                                        onChangeText={setPhone}
                                        keyboardType="phone-pad"
                                    />
                                </View>
                            </View>

                            <View style={styles.divider} />

                            <Text style={styles.sectionTitle}>VisionMate User Info</Text>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Blind Person's Name</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons name="glasses-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="e.g. Robert"
                                        placeholderTextColor="#C7C7CC"
                                        value={blindName}
                                        onChangeText={setBlindName}
                                    />
                                </View>
                            </View>

                            <TouchableOpacity style={styles.button} onPress={handleSave} activeOpacity={0.8}>
                                <LinearGradient
                                    colors={['#007AFF', '#0056B3']}
                                    style={styles.buttonGradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                >
                                    <Text style={styles.buttonText}>Continue to Dashboard</Text>
                                    <Ionicons name="arrow-forward" size={20} color="#FFF" />
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#1C1C1E',
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 16,
        color: '#8E8E93',
        marginTop: 4,
        fontWeight: '500',
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1C1C1E',
        marginBottom: 20,
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E5EA',
        marginVertical: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#8E8E93',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F2F7',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E5EA',
    },
    inputIcon: {
        paddingLeft: 16,
        paddingRight: 8,
    },
    input: {
        flex: 1,
        paddingVertical: 16,
        paddingRight: 16,
        fontSize: 16,
        color: '#1C1C1E',
    },
    button: {
        marginTop: 12,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    buttonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderRadius: 14,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: '700',
        marginRight: 8,
    },
});
