#!/usr/bin/env python3
"""
Test script for SERP API endpoint
Run with: python test_api.py
"""

import urllib.request
import json

def test_trends_api(base_url="http://localhost:3000", niche=None):
    """Test the trends API endpoint"""
    
    url = f"{base_url}/api/trends"
    if niche:
        url += f"?niche={niche}"
    
    print(f"\n🔍 Testing: {url}")
    print("-" * 60)
    
    try:
        with urllib.request.urlopen(url) as response:
            data = json.loads(response.read().decode())
            
            print(f"✅ Status: {response.status}")
            print(f"📊 Success: {data.get('success')}")
            print(f"📈 Count: {data.get('count')}")
            print(f"\n📝 First 3 results:")
            
            for item in data.get('data', [])[:3]:
                print(f"\n  - {item['title']}")
                print(f"    Source: {item['posts']}")
                print(f"    Difficulty: {item['difficulty']}")
                print(f"    Link: {item['link'][:50]}...")
                
    except Exception as e:
        print(f"❌ Error: {e}")


if __name__ == "__main__":
    # Test general trends
    test_trends_api()
    
    # Test with niche
    test_trends_api(niche="Technology")
    test_trends_api(niche="Marketing")
    
    print("\n" + "=" * 60)
    print("✨ Testing complete!")
