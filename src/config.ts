/**
 * VisionMate Mobile App Configuration
 * 
 * IMPORTANT: Change BACKEND_IP to your laptop's IP address
 * Find it by running: ipconfig (Windows) or ifconfig (Mac/Linux)
 */

// Your laptop's IP on the local network
export const BACKEND_IP = '10.199.231.39';
export const BACKEND_PORT = 5001;
export const BACKEND_URL = `http://${BACKEND_IP}:${BACKEND_PORT}`;

// Polling intervals (milliseconds)
export const LOCATION_POLL_INTERVAL = 3000;    // Poll GPS every 3 seconds
export const NOTIFICATION_POLL_INTERVAL = 2000; // Poll notifications every 2 seconds
