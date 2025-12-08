# SERP API Backend for Trendin

This directory contains a Python serverless API that can be deployed on Vercel to handle SERP API calls, solving the CORS issue.

## 📁 Directory Structure

```
api/
├── trends.py          # Main API endpoint
├── requirements.txt   # Python dependencies (empty - uses stdlib)
├── vercel.json       # Vercel configuration
└── README.md         # This file
```

## 🚀 Deployment Steps

### 1. Install Vercel CLI (if not already installed)
```bash
npm install -g vercel
```

### 2. Set Environment Variable
In your Vercel project settings or via CLI:

```bash
vercel env add SERP_API_KEY
```

Then paste your SERP API key: `37298880d0fcef3adfd0564c3a7cca6fd95b1077fa33677fb1cc5fd1ee21cfb6`

### 3. Deploy
From your project root:
```bash
vercel --prod
```

Or just:
```bash
vercel
```

The API will be available at: `https://your-project.vercel.app/api/trends`

## 📡 API Endpoint

### GET `/api/trends`

**Query Parameters:**
- `niche` (optional): Filter trends by niche (e.g., "Technology", "Marketing")

**Example Requests:**
```
# General trends
https://your-project.vercel.app/api/trends

# Technology trends
https://your-project.vercel.app/api/trends?niche=Technology

# Marketing trends
https://your-project.vercel.app/api/trends?niche=Marketing
```

**Response Format:**
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

**Error Response:**
```json
{
  "success": false,
  "error": "Error message here"
}
```

## 🔧 Frontend Integration

Update your `src/lib/api.ts` to use this backend:

```typescript
getTrends: async (niche?: string): Promise<TrendingTopic[]> => {
    try {
        const baseUrl = import.meta.env.VITE_API_URL || 'https://your-project.vercel.app';
        const url = new URL('/api/trends', baseUrl);
        
        if (niche) {
            url.searchParams.append('niche', niche);
        }
        
        const response = await fetch(url.toString());
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.error);
        }
        
        return result.data;
    } catch (error) {
        console.error("Failed to fetch trends:", error);
        return getMockDataForNiche(niche);
    }
}
```

## 🔐 Security Notes

- ✅ SERP API key is stored securely in Vercel environment variables
- ✅ CORS is properly configured to allow frontend requests
- ✅ No API key exposure in frontend code
- ✅ Error handling with fallback to mock data

## 🌍 Environment Variables

Set these in Vercel:

| Variable | Value | Description |
|----------|-------|-------------|
| `SERP_API_KEY` | Your API key | SERP API authentication key |

## 📝 Testing Locally

```bash
# Install Vercel CLI
npm install -g vercel

# Run locally
vercel dev

# Test endpoint
curl "http://localhost:3000/api/trends?niche=Technology"
```

## 🎯 Features

- ✅ Solves CORS issues
- ✅ Secure API key management
- ✅ Serverless (scales automatically)
- ✅ Free tier on Vercel
- ✅ Fast cold start (Python)
- ✅ Full SERP API integration
- ✅ Niche filtering support

## 📊 Cost

- Vercel: **Free tier** includes 100GB bandwidth and serverless functions
- SERP API: Pay per search query

## 🐛 Troubleshooting

**Issue:** `SERP_API_KEY not configured`
- **Solution:** Add environment variable in Vercel dashboard

**Issue:** CORS errors
- **Solution:** Check that `Access-Control-Allow-Origin` is set to `*` or your domain

**Issue:** Function timeout
- **Solution:** Vercel free tier has 10s timeout - should be sufficient for SERP API
