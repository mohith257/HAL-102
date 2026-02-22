"""
Test Face Recognition Module
Tests face detection, enrollment, and recognition
"""
import cv2
import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from face_recognizer import FaceRecognizer
from database import VisionMateDB


def test_face_enrollment():
    """Test face enrollment (Remember feature)"""
    print("=" * 60)
    print("TESTING FACE ENROLLMENT")
    print("=" * 60)
    
    db = VisionMateDB()
    recognizer = FaceRecognizer(db)
    
    print("\nOpening webcam for enrollment...")
    print("Position your face in frame and press SPACE to capture")
    print("Press 'q' to quit")
    
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("✗ Could not open webcam")
        return
    
    enrolled = False
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        
        # Detect faces
        faces = recognizer.detect_faces(frame)
        
        # Draw rectangles
        display = frame.copy()
        for face in faces:
            x1, y1, x2, y2 = face['bbox']
            cv2.rectangle(display, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(
                display,
                f"Confidence: {face['confidence']:.2f}",
                (x1, y1 - 10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.5,
                (0, 255, 0),
                2
            )
        
        # Instructions
        cv2.putText(
            display,
            "Press SPACE to enroll | Q to quit",
            (10, 30),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (255, 255, 255),
            2
        )
        
        cv2.imshow('Face Enrollment', display)
        
        key = cv2.waitKey(1) & 0xFF
        
        if key == ord(' ') and len(faces) > 0:
            name = input("\nEnter name for this face: ").strip()
            if name:
                success = recognizer.enroll_face(frame, name)
                if success:
                    print(f"✓ Successfully enrolled {name}")
                    enrolled = True
                else:
                    print("✗ Enrollment failed")
            
        elif key == ord('q'):
            break
    
    cap.release()
    cv2.destroyAllWindows()
    
    if enrolled:
        print("\n✓ Enrollment test complete!")
    
    db.close()


def test_face_recognition():
    """Test face recognition with webcam"""
    print("=" * 60)
    print("TESTING FACE RECOGNITION")
    print("=" * 60)
    
    db = VisionMateDB()
    recognizer = FaceRecognizer(db)
    
    # Check if we have enrolled faces
    known_faces = db.get_all_faces()
    print(f"\nKnown faces in database: {len(known_faces)}")
    if len(known_faces) == 0:
        print("⚠ No faces enrolled! Run enrollment first.")
        print("Continuing with recognition test (will show 'Unknown')...")
    else:
        for face_id, name, _ in known_faces:
            print(f"  - {name} (ID: {face_id})")
    
    print("\nOpening webcam for recognition...")
    print("Press 'q' to quit")
    
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("✗ Could not open webcam")
        db.close()
        return
    
    frame_count = 0
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        
        frame_count += 1
        
        # Recognize faces (every 5th frame for performance)
        if frame_count % 5 == 0:
            recognized = recognizer.recognize_faces(frame)
            
            # Draw results
            display = recognizer.draw_faces(frame, recognized)
            
            # Print recognition results
            if recognized:
                for face in recognized:
                    print(f"\rRecognized: {face['name']} (distance: {face['distance']:.3f})", end='')
        else:
            display = frame
        
        cv2.putText(
            display,
            "Press Q to quit",
            (10, 30),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (255, 255, 255),
            2
        )
        
        cv2.imshow('Face Recognition Test', display)
        
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    cap.release()
    cv2.destroyAllWindows()
    
    print("\n\n✓ Recognition test complete!")
    db.close()


def test_database_operations():
    """Test database face storage and retrieval"""
    print("=" * 60)
    print("TESTING DATABASE OPERATIONS")
    print("=" * 60)
    
    db = VisionMateDB()
    
    # Get all faces
    faces = db.get_all_faces()
    print(f"\nTotal faces in database: {len(faces)}")
    
    for face_id, name, embedding in faces:
        print(f"  ID {face_id}: {name} (embedding shape: {embedding.shape})")
    
    print("\n✓ Database test complete!")
    db.close()


if __name__ == "__main__":
    print("\nVISIONMATE FACE RECOGNITION TEST SUITE")
    print("=" * 60)
    
    print("\nSelect test mode:")
    print("1. Test enrollment (Remember feature)")
    print("2. Test recognition")
    print("3. View database")
    print("4. Full test (enrollment + recognition)")
    
    choice = input("\nEnter choice (1-4): ").strip()
    
    if choice == '1':
        test_face_enrollment()
    elif choice == '2':
        test_face_recognition()
    elif choice == '3':
        test_database_operations()
    elif choice == '4':
        test_database_operations()
        print("\n")
        test_face_enrollment()
        print("\n")
        test_face_recognition()
    else:
        print("Running database test...")
        test_database_operations()
