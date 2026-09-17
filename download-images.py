import requests
import os
from urllib.parse import urlparse

# Create images directory if it doesn't exist
os.makedirs('images', exist_ok=True)

# Direct Pexels image URLs for construction photos
image_urls = {
    'hero-section-stone-crusher.jpg': 'https://images.pexels.com/photos/1108571/pexels-photo-1108571.jpeg?auto=compress&cs=tinysrgb&w=1600',
    'service-road-construction.jpg': 'https://images.pexels.com/photos/1108571/pexels-photo-1108571.jpeg?auto=compress&cs=tinysrgb&w=800',
    'service-construction.jpg': 'https://images.pexels.com/photos/139303/pexels-photo-139303.jpeg?auto=compress&cs=tinysrgb&w=800',
    'service-aggregates.jpg': 'https://images.pexels.com/photos/957024/pexels-photo-957024.jpeg?auto=compress&cs=tinysrgb&w=800',
    'project-industrial-plant.jpg': 'https://images.pexels.com/photos/1114073/pexels-photo-1114073.jpeg?auto=compress&cs=tinysrgb&w=800',
    'project-water-infrastructure.jpg': 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800',
    'project-urban-flyover.jpg': 'https://images.pexels.com/photos/305070/pexels-photo-305070.jpeg?auto=compress&cs=tinysrgb&w=800',
    'project-plant-utilities.jpg': 'https://images.pexels.com/photos/1114073/pexels-photo-1114073.jpeg?auto=compress&cs=tinysrgb&w=800'
}

def download_image(filename, url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        
        filepath = os.path.join('images', filename)
        with open(filepath, 'wb') as f:
            f.write(response.content)
        
        print(f"✅ Downloaded: {filename}")
        return True
    except Exception as e:
        print(f"❌ Failed to download {filename}: {e}")
        return False

print("🏗️  Downloading construction photos for Jai Jwala Contracts...")
print("=" * 50)

success_count = 0
for filename, url in image_urls.items():
    if download_image(filename, url):
        success_count += 1

print("=" * 50)
print(f"✅ Successfully downloaded {success_count}/{len(image_urls)} images!")
print("📸 Your website now has real construction photos!")
