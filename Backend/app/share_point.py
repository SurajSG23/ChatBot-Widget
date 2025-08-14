import requests
import os
import re
from dotenv import load_dotenv

load_dotenv()

drive_name = "Documents"
site_host = "apcdeloitte.sharepoint.com"
site_name = "GAPGoalsandPerformance"

# Get access token
token_url = f'https://login.microsoftonline.com/{os.getenv("TENANT_ID")}/oauth2/v2.0/token'
token_data = {
    'grant_type': 'client_credentials',
    'client_id': os.getenv("CLIENT_ID"),
    'client_secret': os.getenv("CLIENT_SECRET"),
    'scope': 'https://graph.microsoft.com/.default'
}

response = requests.post(token_url, data=token_data)
if response.status_code == 200:
    access_token = response.json().get('access_token')
else:
    raise Exception(f"Failed to get access token: {response.text}")

headers = {
    'Authorization': f'Bearer {access_token}'
}

# Get site ID
get_site_id_url = f"https://graph.microsoft.com/v1.0/sites/{site_host}:/sites/{site_name}"
response = requests.get(get_site_id_url, headers=headers)
response.raise_for_status()
site_id = response.json()["id"]

# Get drives in the site
get_drives_url = f"https://graph.microsoft.com/v1.0/sites/{site_id}/drives"
response = requests.get(get_drives_url, headers=headers)
response.raise_for_status()
drives = response.json()["value"]

# Find the drive ID for the drive_name
drive_id = next(d["id"] for d in drives if d["name"] == drive_name)

# Recursive function to list all files/folders
def list_drive_items(drive_id, item_id=None):
    if item_id:
        url = f"https://graph.microsoft.com/v1.0/drives/{drive_id}/items/{item_id}/children"
    else:
        url = f"https://graph.microsoft.com/v1.0/drives/{drive_id}/root/children"
    items = []
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    data = response.json()

    items.extend(data['value'])

    # Handle pagination
    while '@odata.nextLink' in data:
        response = requests.get(data['@odata.nextLink'], headers=headers)
        response.raise_for_status()
        data = response.json()
        items.extend(data['value'])

    all_items = []
    for item in items:
        all_items.append(item)
        if item.get('folder'):
            all_items.extend(list_drive_items(drive_id, item['id']))
    return all_items

# Get all items recursively
all_items = list_drive_items(drive_id)

# Filter to only files with .docx extension
docx_files = [item for item in all_items if 'file' in item and item['name'].lower().endswith('.docx')]

print(f"Found {len(docx_files)} Word (.docx) files")

# Function to download file content given the drive_id and file_id
def download_file(drive_id, file_id):
    file_url = f"https://graph.microsoft.com/v1.0/drives/{drive_id}/items/{file_id}"
    file_response = requests.get(file_url, headers=headers)
    file_response.raise_for_status()
    download_url = file_response.json().get('@microsoft.graph.downloadUrl')
    if download_url:
        file_response = requests.get(download_url)
        file_response.raise_for_status()
        return file_response.content
    else:
        raise Exception(f"Cannot get download URL for file id {file_id}")

# Sanitize filenames for saving locally
def sanitize_filename(filename):
    return re.sub(r'[^A-Za-z0-9._-]', '', filename.replace(' ', '_'))

# Download first 5 docx files and save locally
output_dir = "./downloaded_docs"
os.makedirs(output_dir, exist_ok=True)

for file_info in docx_files[:5]:
    print(f"Downloading {file_info['name']}...")
    content = download_file(drive_id, file_info['id'])
    
    safe_name = sanitize_filename(file_info['name'])
    save_path = os.path.join(output_dir, safe_name)
    
    with open(save_path, 'wb') as f:
        f.write(content)
    
    print(f"Saved {file_info['name']} to {save_path}")
