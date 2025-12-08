from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import urllib.request
import urllib.parse
import json
import os


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Parse URL and query parameters
        parsed_path = urlparse(self.path)
        query_params = parse_qs(parsed_path.query)
        
        # Get niche parameter (optional)
        niche = query_params.get('niche', [None])[0]
        
        # Get API key from environment variable
        api_key = os.environ.get('SERP_API_KEY')
        
        if not api_key:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            error_response = json.dumps({
                'error': 'SERP_API_KEY not configured'
            })
            self.wfile.write(error_response.encode())
            return
        
        try:
            # Build query
            query = f"{niche} trends" if niche else "business technology trends"
            
            # Build SERP API URL
            params = {
                'engine': 'google_news',
                'q': query,
                'gl': 'us',
                'hl': 'en',
                'api_key': api_key
            }
            
            serp_url = f"https://serpapi.com/search.json?{urllib.parse.urlencode(params)}"
            
            # Make request to SERP API
            with urllib.request.urlopen(serp_url) as response:
                serp_data = json.loads(response.read().decode())
            
            # Extract news results
            news_results = serp_data.get('news_results', [])
            
            # Transform to our format
            trending_topics = []
            for idx, item in enumerate(news_results[:20]):
                trending_topics.append({
                    'id': str(idx + 1),
                    'title': item.get('title', 'Trending Story'),
                    'posts': f"via {item.get('source', {}).get('name', 'Unknown')}" if item.get('source') else 'Trending',
                    'difficulty': 'High' if idx % 3 == 0 else ('Med' if idx % 3 == 1 else 'Low'),
                    'link': item.get('link', '')
                })
            
            # Send success response
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            
            response_data = json.dumps({
                'success': True,
                'data': trending_topics,
                'count': len(trending_topics)
            })
            self.wfile.write(response_data.encode())
            
        except Exception as e:
            # Send error response
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            error_response = json.dumps({
                'success': False,
                'error': str(e)
            })
            self.wfile.write(error_response.encode())
    
    def do_OPTIONS(self):
        # Handle CORS preflight
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
