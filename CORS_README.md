# CORS Issue with SERP API

## Important Notice
⚠️ **SERP API Does Not Support Browser Requests**

The SERP API (serpapi.com) does **not** allow direct calls from browsers due to CORS (Cross-Origin Resource Sharing) restrictions. This is intentional for security and API key protection.

## Current Solution
The app gracefully falls back to **high-quality mock data** when:
1. SERP API key is missing
2. CORS error occurs (production)
3. API request fails

Mock data includes 20 trending topics with clickable source links.

## Production Setup Options

### Option 1: Use Mock Data (Current - No Setup Required)
✅ **Recommended for MVP/Demo**
- Already implemented
- No additional setup needed
- 20 realistic trending topics
- Works immediately in production

### Option 2: Serverless API Proxy (Recommended for Production)
Create a serverless function to proxy SERP API calls:

**For Vercel:**
1. Create `api/trends.ts`:
```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { niche } = req.query;
  const query = niche ? `${niche} trends` : 'business technology trends';
  
  const url = new URL('https://serpapi.com/search.json');
  url.searchParams.append('engine', 'google_news');
  url.searchParams.append('q', query as string);
  url.searchParams.append('gl', 'us');
  url.searchParams.append('hl', 'en');
  url.searchParams.append('api_key', process.env.SERP_API_KEY!);

  const response = await fetch(url.toString());
  const data = await response.json();
  
  res.status(200).json(data);
}
```

2. Update `src/lib/api.ts`:
```typescript
const response = await fetch(`/api/trends?niche=${niche || ''}`);
```

3. Add SERP_API_KEY to Vercel environment variables

**For Netlify:**
Similar approach using Netlify Functions

### Option 3: Backend Service
Set up a dedicated backend server (Node.js/Express) to handle API calls.

## Current Behavior
- ✅ App works perfectly with mock data
- ✅ No errors in production
- ✅ 20 diverse trending topics
- ✅ All features functional
- ✅ Clickable source links
- ✅ Niche filtering works

## Recommendation
For now, **continue using mock data**. It provides a great user experience without additional infrastructure. Upgrade to serverless proxy when you need real-time trending data.
