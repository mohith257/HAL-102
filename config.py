"""
VisionMate Configuration File
Contains all system parameters and settings
"""
import os

# Project Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_PATH = os.path.join(BASE_DIR, "data", "visionmate.db")
MODELS_DIR = os.path.join(BASE_DIR, "models")
TEST_DATA_DIR = os.path.join(BASE_DIR, "test", "test_data")

# YOLOv8 Configuration
YOLO_MODEL = "yolov8n.pt"  # Nano model for speed
YOLO_CONFIDENCE = 0.5
YOLO_IOU_THRESHOLD = 0.45
TARGET_CLASSES = ['person', 'chair', 'bottle', 'couch', 'tv', 'keys', 'cell phone', 'clock']  # 'couch' is COCO's 'sofa', 'clock' includes watches

# Face Recognition Configuration
FACE_RECOGNITION_THRESHOLD = 0.65  # Euclidean distance threshold (higher = more lenient)
FACE_MODEL = "buffalo_l"  # InsightFace model
FACE_DET_SIZE = (640, 640)

# Item Tracking Configuration
ITEM_TRACKING_TIMEOUT = 3.0  # seconds
IOU_THRESHOLD = 0.3  # Minimum IoU to consider "inside"

# Object Memory Configuration (Remember Objects Feature)
OBJECT_MEMORY_MATCH_THRESHOLD = 0.5  # Minimum confidence to recognize remembered object (lowered for better detection)
OBJECT_ENROLLMENT_FRAMES = 5  # Number of frames to capture during enrollment
OBJECT_MATCH_COOLDOWN = 2.0  # seconds between announcing same object
USE_DEEP_FEATURES = True  # Use deep learning embeddings (MobileNetV2) for much better recognition

# Traffic Signal Configuration
TRAFFIC_HSV_RED_LOWER = [0, 120, 70]
TRAFFIC_HSV_RED_UPPER = [10, 255, 255]
TRAFFIC_HSV_GREEN_LOWER = [40, 40, 40]
TRAFFIC_HSV_GREEN_UPPER = [80, 255, 255]
TRAFFIC_MIN_AREA = 100  # Minimum pixel area for signal detection

# Audio Feedback Priority (1 = highest)
PRIORITY_EMERGENCY = 1
PRIORITY_SOCIAL = 2
PRIORITY_NAVIGATIONAL = 3
PRIORITY_STATUS = 4

# Server Configuration
FLASK_HOST = "0.0.0.0"
FLASK_PORT = 5000
FLASK_DEBUG = False

# Google Maps API Configuration
# SECURITY NOTE: Keep this key private! Add config.py to .gitignore before pushing to GitHub
GOOGLE_MAPS_API_KEY = "AIzaSyBqXAmgcRTvtbuW7vxE_6Jv0aKfQ4yu4FM"

# Navigation Configuration
NAVIGATION_ANNOUNCEMENT_DISTANCE = 50  # meters - announce turns when this close
NAVIGATION_REROUTE_DISTANCE = 30  # meters - reroute if user is this far off track
NAVIGATION_ARRIVAL_DISTANCE = 20  # meters - consider arrived when within this distance
NAVIGATION_UPDATE_INTERVAL = 5  # seconds - how often to check position

# GPS Configuration
GPS_MOCK_MODE = True  # Set to False when real GPS is connected
GPS_PORT = "/dev/ttyUSB0"  # Serial port for GPS module (adjust for your system)
GPS_BAUDRATE = 9600

# Ultrasonic Sensor Configuration
ULTRASONIC_MOCK_MODE = True  # Set to False when ESP32 is connected
ULTRASONIC_PORT = "COM3"  # Serial port for ESP32 (Windows: COM3, Linux: /dev/ttyUSB1)
ULTRASONIC_BAUDRATE = 115200
ULTRASONIC_MAX_DISTANCE = 400  # cm - maximum reliable distance
ULTRASONIC_OBSTACLE_THRESHOLD = 100  # cm - warn if obstacle closer than this

# Performance
TARGET_FPS = 30
MAX_FRAME_QUEUE = 10
