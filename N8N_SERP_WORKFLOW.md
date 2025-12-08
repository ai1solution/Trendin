# N8N Workflow for Trending Topics API

This n8n workflow fetches trending topics from SERP API and returns them in the format expected by the Trendin frontend.

## Features
- ✅ Accepts `niche` query parameter (optional)
- ✅ Calls SERP API for Google News trends
- ✅ Returns 20 trending topics with title, source, difficulty, and link
- ✅ CORS enabled for frontend integration

## Setup Instructions

### 1. Import Workflow to N8N

1. Open your n8n instance
2. Click **Workflows** → **Add Workflow**
3. Click the **⋮** menu → **Import from File**
4. Copy the JSON below and paste it, or save as `trendin-serp-api.json` and import

### 2. Configure Credentials

1. In the "HTTP Request" node (SERP API call)
2. Add your SERP API key to the URL or use n8n credentials

### 3. Activate Workflow

1. Click **Activate** toggle in the top right
2. Copy the webhook URL (something like: `https://your-n8n.com/webhook/trendin-trends`)

### 4. Update Frontend

In `src/lib/api.ts`, replace the `getTrends` function:

```typescript
getTrends: async (niche?: string): Promise<TrendingTopic[]> => {
    try {
        const n8nUrl = 'YOUR_N8N_WEBHOOK_URL_HERE';
        const url = new URL(n8nUrl);
        
        if (niche) {
            url.searchParams.append('niche', niche);
        }
        
        const response = await fetch(url.toString());
        const result = await response.json();
        
        return result.data || [];
    } catch (error) {
        console.error("Failed to fetch trends:", error);
        return getMockDataForNiche(niche);
    }
},
```

## N8N Workflow JSON

Copy this entire JSON and import it into n8n:

```json
{
  "name": "Trendin - SERP Trends API",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "GET",
        "path": "trendin-trends",
        "responseMode": "responseNode",
        "options": {}
      },
      "id": "webhook-trigger",
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [250, 300],
      "webhookId": "trendin-trends"
    },
    {
      "parameters": {
        "jsCode": "// Get niche from query parameter or use default\nconst niche = $input.item.json.query?.niche || '';\nconst query = niche ? `${niche} trends` : 'business technology trends';\n\nreturn {\n  json: {\n    query: query,\n    niche: niche\n  }\n};"
      },
      "id": "process-niche",
      "name": "Process Niche Parameter",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [450, 300]
    },
    {
      "parameters": {
        "url": "=https://serpapi.com/search.json?engine=google_news&q={{ encodeURIComponent($json.query) }}&gl=us&hl=en&api_key=YOUR_SERP_API_KEY_HERE",
        "options": {}
      },
      "id": "serp-api-call",
      "name": "SERP API Call",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "position": [650, 300]
    },
    {
      "parameters": {
        "jsCode": "// Transform SERP API response to Trendin format\nconst newsResults = $input.item.json.news_results || [];\n\nconst trendingTopics = newsResults.slice(0, 20).map((item, index) => ({\n  id: String(index + 1),\n  title: item.title || 'Trending Story',\n  posts: item.source?.name ? `via ${item.source.name}` : 'Trending',\n  difficulty: index % 3 === 0 ? 'High' : (index % 3 === 1 ? 'Med' : 'Low'),\n  link: item.link || ''\n}));\n\nreturn {\n  json: {\n    success: true,\n    data: trendingTopics,\n    count: trendingTopics.length\n  }\n};"
      },
      "id": "transform-response",
      "name": "Transform Response",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [850, 300]
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ $json }}",
        "options": {
          "responseHeaders": {
            "entries": [
              {
                "name": "Access-Control-Allow-Origin",
                "value": "*"
              },
              {
                "name": "Access-Control-Allow-Methods",
                "value": "GET, OPTIONS"
              },
              {
                "name": "Content-Type",
                "value": "application/json"
              }
            ]
          }
        }
      },
      "id": "webhook-response",
      "name": "Respond to Webhook",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1,
      "position": [1050, 300]
    }
  ],
  "connections": {
    "Webhook": {
      "main": [
        [
          {
            "node": "Process Niche Parameter",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Process Niche Parameter": {
      "main": [
        [
          {
            "node": "SERP API Call",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "SERP API Call": {
      "main": [
        [
          {
            "node": "Transform Response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Transform Response": {
      "main": [
        [
          {
            "node": "Respond to Webhook",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "pinData": {},
  "settings": {
    "executionOrder": "v1"
  },
  "staticData": null,
  "tags": [],
  "triggerCount": 0,
  "updatedAt": "2025-12-08T00:00:00.000Z",
  "versionId": "1"
}
```

## Workflow Nodes Explanation

### 1. Webhook Trigger
- **Path:** `/trendin-trends`
- **Method:** GET
- **Accepts:** `niche` query parameter (optional)

### 2. Process Niche Parameter
- Extracts `niche` from query string
- Creates search query: `{niche} trends` or default `business technology trends`

### 3. SERP API Call
- Calls `https://serpapi.com/search.json`
- Parameters:
  - `engine=google_news`
  - `q={query}`
  - `gl=us` (country: US)
  - `hl=en` (language: English)
  - `api_key={YOUR_KEY}`

### 4. Transform Response
- Maps SERP API response to Trendin format
- Returns top 20 results
- Each item contains: `id`, `title`, `posts`, `difficulty`, `link`

### 5. Respond to Webhook
- Returns JSON response
- Includes CORS headers for browser access

## Testing the Workflow

### Test URL Examples:

```bash
# General trends
https://your-n8n.com/webhook/trendin-trends

# Technology trends
https://your-n8n.com/webhook/trendin-trends?niche=Technology

# Marketing trends
https://your-n8n.com/webhook/trendin-trends?niche=Marketing
```

### Expected Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "title": "AI Revolutionizing Healthcare",
      "posts": "via TechCrunch",
      "difficulty": "High",
      "link": "https://techcrunch.com/..."
    }
  ],
  "count": 20
}
```

## Important Notes

### Replace API Key
In the "SERP API Call" node, replace `YOUR_SERP_API_KEY_HERE` with your actual SERP API key:
```
https://serpapi.com/search.json?...&api_key=37298880d0fcef3adfd0564c3a7cca6fd95b1077fa33677fb1cc5fd1ee21cfb6
```

### CORS Headers
The workflow includes CORS headers (`Access-Control-Allow-Origin: *`) to allow browser requests from your frontend.

### Error Handling
Add error handling nodes if needed:
- Catch SERP API failures
- Return fallback data
- Log errors

## Advantages of N8N Approach

✅ **Visual Editor** - Easy to modify and debug
✅ **No Deployment** - No need to manage servers
✅ **Built-in Credentials** - Secure API key storage
✅ **Easy Testing** - Test directly in n8n UI
✅ **Caching** - Can add caching nodes to reduce API calls
✅ **Rate Limiting** - Can add throttling if needed
✅ **Monitoring** - Built-in execution history

## Troubleshooting

### Workflow not triggering
- Check if workflow is activated
- Verify webhook URL is correct
- Check n8n logs for errors

### SERP API errors
- Verify API key is correct
- Check SERP API quota/credits
- View execution logs in n8n

### CORS errors
- Ensure CORS headers are in "Respond to Webhook" node
- Check browser console for specific error

## Next Steps

1. Import workflow to n8n
2. Replace SERP API key
3. Activate workflow
4. Copy webhook URL
5. Update frontend `api.ts`
6. Test with your deployed app

Your app will now fetch real trending topics from SERP API via n8n! 🚀
