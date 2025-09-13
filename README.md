# LinkedIn Content Generator

A professional LinkedIn content generator built with Next.js and Chakra UI, designed to create engaging LinkedIn posts using AI-powered content generation.

## Features

- 🎯 AI-powered content generation based on keywords
- 📝 Multiple post draft variations
- 🔥 Trending topic analysis
- 💡 Content angle suggestions
- 🎨 Professional LinkedIn-themed UI
- 🌙 Dark/Light mode support
- 📱 Responsive design
- 🔧 Test mode for development
- ✏️ Editable post content
- 📋 One-click copy to clipboard

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:
   ```
   NEXT_PUBLIC_WEBHOOK_URL=your_n8n_webhook_url_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3002](http://localhost:3002) in your browser

## Project Structure

```
├── components/
│   ├── PostCard.jsx      # Individual post card component
│   └── Summary.jsx       # Analysis summary component
├── pages/
│   ├── _app.js          # App configuration with Chakra UI theme
│   └── index.js         # Main page component
├── package.json
└── README.md
```

## API Integration

The application integrates with an n8n webhook that expects:

**Input:**
```json
{
  "keywords": "your topic here"
}
```

**Expected Output:**
```json
[
  {
    "ok": true,
    "payload": {
      "output": {
        "trends": ["trend1", "trend2"],
        "angles": ["angle1", "angle2"],
        "post_drafts": [
          {
            "title": "Post Title",
            "content": "Post content...",
            "hashtags": ["#hashtag1", "#hashtag2"]
          }
        ],
        "similar_posts": [
          {
            "title": "Similar Post Title",
            "why_it_is_engaging": "Explanation...",
            "post_url": "https://linkedin.com/..."
          }
        ]
      }
    }
  }
]
```

## Design System

- **Primary Color**: LinkedIn Blue (#0077B5)
- **Font**: IBM Plex Sans
- **UI Framework**: Chakra UI
- **Animation**: Framer Motion
- **Theme**: Professional, clean, LinkedIn-inspired

## Development

- `npm run dev` - Start development server on port 3001
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Test Mode

The application includes a test mode that uses mock data for development and testing purposes. Toggle test mode using the button in the interface.

## Contributing

1. Follow the existing code style and patterns
2. Use Chakra UI components consistently
3. Maintain responsive design principles
4. Test both light and dark modes
5. Ensure accessibility standards are met
