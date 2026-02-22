# VisionMate - AI Backend for Assistive Smart Glasses

🚀 **AI-powered assistive technology for the visually impaired**

This is the **AI + Backend** implementation for the VisionMate smart glasses project, built for hackathon demonstration without hardware dependencies.

---

## 🎯 Project Overview

VisionMate uses computer vision and AI to help visually impaired users navigate their environment through:
- **Object Detection** - Identify obstacles and everyday items
- **Face Recognition** - Remember and recognize people
- **Traffic Signal Detection** - Safety alerts for crossing streets
- **Item Tracking** - Find misplaced objects ("Where are my keys?")
- **Priority-based Audio Feedback** - Context-aware voice announcements

---

## 📁 Project Structure

```
Model_for_VisionMate/
│
├── config.py                    # Configuration settings
├── database.py                  # SQLite database manager
├── object_detector.py           # YOLOv8 object detection
├── face_recognizer.py           # InsightFace face recognition
├── traffic_signal_detector.py   # HSV-based traffic light detection
├── item_tracker.py              # IoU-based item tracking
├── audio_feedback.py            # Priority-based TTS system
├── server.py                    # Flask API server
├── requirements.txt             # Python dependencies
│
├── data/                        # Database files (auto-created)
│   └── visionmate.db
│
├── models/                      # AI model weights (auto-downloaded)
│
└── test/                        # Test scripts
    ├── test_object_detection.py
    ├── test_face_recognition.py
    ├── test_traffic_signals.py
    ├── test_item_tracking.py
    ├── test_integration.py
    └── test_server_api.py
```

---

## 🛠️ Installation & Setup

### Prerequisites
- **Python 3.10+**
- **Webcam** (for testing)
- **GPU** (optional, for faster inference)

### Step 1: Install Dependencies

```powershell
# Install all required packages
pip install -r requirements.txt
```

**Note**: First run will auto-download YOLOv8 (~6MB) and InsightFace models (~200MB)

### Step 2: Verify Installation

```powershell
python database.py
python object_detector.py
```

You should see "✓ initialized successfully" messages.

---

## 🚀 Quick Start

### Option 1: Test Individual Modules

```powershell
# Test object detection
python test/test_object_detection.py

# Test face recognition
python test/test_face_recognition.py

# Test traffic signal detection
python test/test_traffic_signals.py

# Test item tracking
python test/test_item_tracking.py
```

### Option 2: Test Full Integration

```powershell
# Run integrated pipeline
python test/test_integration.py
```

### Option 3: Start API Server

```powershell
# Terminal 1: Start server
python server.py

# Terminal 2: Test API endpoints
python test/test_server_api.py
```

---

## 🎮 Features & How to Test

### 1️⃣ Object Detection (YOLOv8)
**Target Classes**: Person, Chair, Bottle, Sofa, TV, Keys

```powershell
python test/test_object_detection.py
# Choose option 1 for webcam test
```

**Expected**: Real-time bounding boxes around detected objects

---

### 2️⃣ Face Recognition ("Remember" Feature)
**Enrollment + Recognition using InsightFace**

```powershell
python test/test_face_recognition.py
# Choose option 1 to enroll faces
# Choose option 2 to test recognition
```

**Workflow**:
1. Enroll: Press SPACE to capture face, enter name
2. Recognition: System automatically identifies enrolled faces
3. Distance < 0.6 = Match, > 0.6 = Unknown

---

### 3️⃣ Traffic Signal Detection
**HSV color masking for Red/Green lights**

```powershell
python test/test_traffic_signals.py
# Choose option 1 for synthetic test
# Choose option 2 for webcam test
```

**Test Tip**: Show red/green objects to camera (e.g., colored paper)

---

### 4️⃣ Item Tracking ("Find My Keys")
**IoU-based passive tracking**

```powershell
python test/test_item_tracking.py
# Choose option 2 for simulation
# Choose option 3 for live tracking
```

**How it works**:
- Place small object on/near large object
- System tracks for 3 seconds
- Confirms location and saves to database
- Query with "Where are my keys?"

---

### 5️⃣ Audio Feedback System
**Priority Hierarchy**:
1. EMERGENCY (Traffic signals) - **Interrupts everything**
2. SOCIAL (Recognized faces)
3. NAVIGATIONAL (Obstacles)
4. STATUS (Item locations)

**Test in integration**:
```powershell
python test/test_integration.py
```

---

## 🌐 API Endpoints

**Base URL**: `http://localhost:5000`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Server health check |
| `/process_frame` | POST | Main AI inference |
| `/enroll_face` | POST | Enroll new face |
| `/query_item` | GET | Find item location |
| `/get_all_faces` | GET | List enrolled faces |

### Example API Request

```python
import requests
import base64

# Encode image
with open('frame.jpg', 'rb') as f:
    img_base64 = base64.b64encode(f.read()).decode()

# Process frame
response = requests.post(
    'http://localhost:5000/process_frame',
    json={
        'image': f'data:image/jpeg;base64,{img_base64}',
        'return_annotated': False
    }
)

results = response.json()
print(results)
```

---

## 📊 Performance Benchmarks

**Target**: 30+ FPS for real-time processing

| Component | Inference Time (CPU) | Inference Time (GPU) |
|-----------|---------------------|---------------------|
| YOLOv8n | ~40ms | ~10ms |
| InsightFace | ~60ms | ~15ms |
| Traffic Signal | ~5ms | ~5ms |
| **Total Pipeline** | ~110ms (9 FPS) | ~30ms (33 FPS) |

**Optimization Tips**:
- Use GPU for real-time performance
- Process face recognition every 5 frames
- Skip frame if queue is full

---

## 🧪 Testing Checklist

Before your hackathon demo:

- [ ] **Object Detection**: Detects chair, person, bottle
- [ ] **Face Enrollment**: Successfully enroll 2-3 people
- [ ] **Face Recognition**: Recognizes enrolled faces with <0.6 distance
- [ ] **Traffic Signals**: Detects red and green lights
- [ ] **Item Tracking**: Track item location for 3+ seconds
- [ ] **Audio Feedback**: Correct priority order
- [ ] **API Server**: All endpoints return 200 OK
- [ ] **Performance**: Measure actual FPS on your hardware

---

## 🐛 Troubleshooting

### Issue: "No module named 'insightface'"
**Solution**:
```powershell
pip install insightface onnxruntime
```

### Issue: "Could not open webcam"
**Solution**:
- Check if camera is already in use
- Try different camera index: `cv2.VideoCapture(1)`

### Issue: Low FPS (<10 FPS)
**Solution**:
- Reduce frame resolution
- Process every Nth frame
- Use GPU if available

### Issue: Face recognition always returns "Unknown"
**Solution**:
- Check enrollment: `python test/test_face_recognition.py` (option 3)
- Ensure good lighting
- Lower threshold in `config.py`: `FACE_RECOGNITION_THRESHOLD = 0.7`

### Issue: Traffic signal not detected
**Solution**:
- Adjust HSV ranges in `config.py`
- Test with pure red/green objects first
- Use test_traffic_signals.py option 3 to verify ranges

---

## 📝 Database Schema

### Faces Table
```sql
CREATE TABLE faces (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    embedding TEXT NOT NULL,  -- JSON array of 512 floats
    timestamp DATETIME
);
```

### Item Locations Table
```sql
CREATE TABLE item_locations (
    id INTEGER PRIMARY KEY,
    item TEXT NOT NULL,
    location TEXT NOT NULL,
    timestamp DATETIME,
    UNIQUE(item)
);
```

---

## 🎯 2-Day Implementation Status

### ✅ Day 1 (Completed)
- [x] Project structure
- [x] YOLOv8 object detection
- [x] Face recognition with InsightFace
- [x] SQLite database
- [x] Item tracking logic
- [x] Traffic signal detection

### ✅ Day 2 (Completed)
- [x] Audio feedback system
- [x] Flask API server
- [x] Integration pipeline
- [x] Comprehensive test suite
- [x] Documentation

---

## 🚀 Next Steps (Hardware Integration)

When you get the Raspberry Pi 5:

1. **Video Streaming**: Implement socket/Flask streaming from Pi to laptop
2. **GPIO Integration**: Add button interrupt for "Remember" feature
3. **Audio Output**: Connect speaker/headphones to Pi
4. **Model Optimization**: Convert to ONNX/OpenVINO for edge deployment
5. **Power Management**: Battery monitoring and alerts

---

## 📚 Key Technologies

- **YOLOv8n**: Real-time object detection
- **InsightFace**: Face recognition with 512-d embeddings
- **OpenCV**: Image processing and camera interface
- **SQLite**: Lightweight embedded database
- **Flask**: RESTful API server
- **gTTS/pyttsx3**: Text-to-speech engines

---

## 🤝 Contributing

For the hackathon team:
1. Test each module individually
2. Report issues with specific test scripts
3. Suggest new features or improvements

---

## 📄 License

MIT License - Free for hackathon and educational use

---

## 👨‍💻 Author

Built for VisionMate Hackathon Project
**Focus**: AI Backend + Testing (No Hardware Required)

---

## 🎉 Good Luck at Your Hackathon!

**Demo Tips**:
1. Pre-enroll faces of judges/audience
2. Prepare traffic light images/videos
3. Practice "Find My Keys" demo
4. Show priority audio interruption
5. Measure and display FPS during demo

**Questions?** Check test scripts for usage examples!
