import requests
import time
import random

project_id = "sapa-hebat"
base_url = f"https://firestore.googleapis.com/v1/projects/{project_id}/databases/(default)/documents"

def create_kelas(name, tingkat):
    current_id = str(int(time.time() * 1000) + random.randint(0, 999))
    payload = {
        "fields": {
            "name": {"stringValue": name},
            "tingkat": {"stringValue": tingkat},
            "id": {"stringValue": current_id}
        }
    }
    
    try:
        r = requests.post(f"{base_url}/kelas", json=payload)
        if r.status_code not in [200, 201]:
            print(f"Error creating {name}: {r.text}")
        else:
            print(f"Successfully created {name}")
    except Exception as e:
        print(f"Request error for {name}: {e}")

# Data to inject
classes = []
# 7A-J
for char in 'ABCDEFGHIJ':
    classes.append((f"7{char}", "7"))
# 8A-J
for char in 'ABCDEFGHIJ':
    classes.append((f"8{char}", "8"))
# 9A-J
for char in 'ABCDEFGHIJ':
    classes.append((f"9{char}", "9"))

for name, tingkat in classes:
    create_kelas(name, tingkat)
    # Slight delay to avoid hitting rate limits or causing issues with identical timestamps (though we add random)
    time.sleep(0.1)
