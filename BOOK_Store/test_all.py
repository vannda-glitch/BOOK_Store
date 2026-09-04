import requests
import json

BASE_URL = "http://127.0.0.1:8000/api/v1"

print("=" * 50)
print("TESTING BOOK STORE API")
print("=" * 50)

# 1. Health Check
print("\n1. Health Check:")
response = requests.get("http://127.0.0.1:8000/health")
print(f"Status: {response.status_code}")
print(f"Response: {response.json()}")

# 2. Register User
print("\n2. Register User:")
register_data = {
    "email": "demo@example.com",
    "username": "demouser",
    "password": "Test123!",
    "full_name": "Demo User"
}
response = requests.post(f"{BASE_URL}/auth/register", json=register_data)
print(f"Status: {response.status_code}")
if response.status_code == 200:
    print(f"✅ User registered: {response.json()['email']}")
else:
    print(f"Response: {response.json()}")

# 3. Login
print("\n3. Login:")
login_data = {"username": "demo@example.com", "password": "Test123!"}
response = requests.post(f"{BASE_URL}/auth/login", data=login_data)
print(f"Status: {response.status_code}")
if response.status_code == 200:
    token = response.json()["access_token"]
    print(f"✅ Login successful!")
    print(f"Token: {token[:30]}...")
else:
    print(f"Response: {response.json()}")
    exit()

# 4. Get Books (Public)
print("\n4. Get Books:")
response = requests.get(f"{BASE_URL}/books/")
print(f"Status: {response.status_code}")
if response.status_code == 200:
    data = response.json()
    print(f"✅ Found {data.get('total', 0)} books")
else:
    print(f"Response: {response.json()}")

# 5. Get User Profile (Protected)
print("\n5. Get User Profile:")
headers = {"Authorization": f"Bearer {token}"}
response = requests.get(f"{BASE_URL}/users/me", headers=headers)
print(f"Status: {response.status_code}")
if response.status_code == 200:
    print(f"✅ User: {response.json()['username']}")
else:
    print(f"Response: {response.json()}")

# 6. Admin Login
print("\n6. Admin Login:")
admin_login = {"username": "admin@bookstore.com", "password": "Admin123!"}
response = requests.post(f"{BASE_URL}/auth/login", data=admin_login)
print(f"Status: {response.status_code}")
if response.status_code == 200:
    admin_token = response.json()["access_token"]
    print(f"✅ Admin login successful!")
    
    # 7. Admin Dashboard
    print("\n7. Admin Dashboard:")
    headers = {"Authorization": f"Bearer {admin_token}"}
    response = requests.get(f"{BASE_URL}/admin/dashboard", headers=headers)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Dashboard Stats:")
        print(f"  - Total Users: {data['total_users']}")
        print(f"  - Total Books: {data['total_books']}")
        print(f"  - Total Orders: {data['total_orders']}")
        print(f"  - Total Revenue: ${data['total_revenue']}")
    else:
        print(f"Response: {response.json()}")

print("\n" + "=" * 50)
print("✅ API Testing Complete!")
print("=" * 50)