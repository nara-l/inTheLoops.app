Create a Chrome Extension called TweetCurator for Twitter/X.com

Requirements:
1. Manifest V3 Chrome extension
2. Content script that runs on twitter.com and x.com
3. Add small checkboxes to the left of each tweet reply (not the main tweet)
4. Add a floating "Export Selection" button when at least one reply is selected
5. When Export is clicked, capture:
   - Original tweet text and author
   - Selected replies with text and authors
   - Tweet URL
6. For now, just console.log the captured data in a clean JSON format

File structure:
- manifest.json
- content.js
- styles.css

Make it work on the current Twitter/X DOM structure. Use MutationObserver to handle dynamically loaded replies.

Style: Minimal and clean, checkboxes should be subtle but visible.Create a beautiful web app viewer for curated Twitter conversations called TweetCurator.

Tech Stack:
- Next.js 14 with App Router
- Tailwind CSS
- Framer Motion for smooth animations
- Lucide icons

Core Features:
1. A stunning landing page that receives curated conversation data
2. Display format:
   - Original tweet as a hero card with subtle gradient background
   - Selected replies as elegant cards below
   - Each reply should animate in on scroll
   - Author info with avatar placeholder (colored circles with initials)
   - Timestamp and engagement metrics if available
   - Subtle connecting lines between original and replies

Design Requirements:
- Clean, modern design inspired by Arc browser's aesthetic
- Soft shadows and subtle gradients
- Beautiful typography (Inter for UI, perhaps Crimson Pro for tweet text)
- Dark mode and light mode
- Mobile-first responsive design
- Smooth animations and micro-interactions
- Reading time estimate
- "Curated by [curator name]" attribution

Special Features:
- Floating action button to share/save
- Smooth parallax scrolling
- Progressive blur on scroll for header
- Option to view as "Thread mode" or "Card mode"
- Beautiful Open Graph preview when shared
- Reaction buttons for viewers (🔥 🤔 💭 👏)

Color Palette:
- Light mode: Clean whites, soft grays, accent with blue/purple gradients
- Dark mode: Rich blacks, deep purples, electric blue accents
- Reply cards should have subtle color coding (supporting/opposing/neutral)

Create these pages:
1. /view/[id] - The beautiful conversation viewer
2. / - Simple landing explaining the product
3. /demo - A demo with sample data

Make it feel premium, like something people would pay $3/month for.