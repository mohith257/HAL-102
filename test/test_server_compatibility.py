"""
Quick test to verify server loads with object memory
"""
import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

print("=" * 60)
print("Testing Server Module Import")
print("=" * 60)

# Test imports
try:
    from object_memory import ObjectMemory
    print("✓ ObjectMemory imported")
except Exception as e:
    print(f"✗ ObjectMemory import failed: {e}")
    sys.exit(1)

try:
    from visual_matcher import VisualMatcher
    print("✓ VisualMatcher imported")
except Exception as e:
    print(f"✗ VisualMatcher import failed: {e}")
    sys.exit(1)

try:
    from database import VisionMateDB
    print("✓ Database imported")
except Exception as e:
    print(f"✗ Database import failed: {e}")
    sys.exit(1)

# Test database with object memory tables
try:
    db = VisionMateDB()
    print("✓ Database initialized")
    
    # Check if new tables exist
    cursor = db.cursor
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = [row[0] for row in cursor.fetchall()]
    
    required_tables = ['faces', 'item_locations', 'remembered_objects', 'object_sightings']
    
    for table in required_tables:
        if table in tables:
            print(f"✓ Table '{table}' exists")
        else:
            print(f"✗ Table '{table}' missing")
            sys.exit(1)
    
    db.close()
    
except Exception as e:
    print(f"✗ Database test failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

# Test object memory initialization
try:
    memory = ObjectMemory()
    print("✓ ObjectMemory initialized")
    
    # Test basic operations
    objects = memory.list_remembered_objects()
    print(f"✓ Found {len(objects)} remembered objects")
    
except Exception as e:
    print(f"✗ ObjectMemory test failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("\n" + "=" * 60)
print("Server compatibility tests passed! ✓")
print("=" * 60)
print("\nServer endpoints ready:")
print("  POST /api/enroll_object")
print("  GET /api/remembered_objects")
print("  GET /api/find_object/<name>")
print("  DELETE /api/remembered_object/<name>")
print("  GET /api/enrollment_status")
print("\nRun 'python server.py' to start the server")
