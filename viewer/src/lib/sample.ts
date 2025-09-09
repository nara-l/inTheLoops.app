import type { Conversation } from "./types";

export const demoConversation: Conversation = {
  id: "demo1",
  url: "https://twitter.com/user/status/1234567890",
  subject: "Premium-feel product details",
  platform: "twitter",
  original: {
    id: "1234567890",
    author: { name: "Jane Doe", handle: "janedoe" },
    text:
      "What are the underrated UX details that make a product feel premium?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    metrics: { likes: 1342, replies: 212, reposts: 97 },
  },
  replies: [
    {
      id: "1234567891",
      author: { name: "Sam Chen", handle: "itsamsam" },
      text:
        "Micro-interactions that anticipate intent. Cursor proximity, hover affordances, and subtle spring animations.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      metrics: { likes: 312, replies: 9 },
      sentiment: "support",
      category: "hot",
      featured: true,
      reason: "Nails the 'premium feel' via micro-interactions.",
    },
    {
      id: "1234567892",
      author: { name: "Ava Patel", handle: "avaa" },
      text:
        "Text rendering matters: optical sizing, proper line-length, and contrast. Inter + a serif for content is a great pair.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      metrics: { likes: 221, replies: 6 },
      sentiment: "neutral",
      category: "cold",
      reason: "Grounded guidance on typography and readability.",
    },
    {
      id: "1234567893",
      author: { name: "Jon", handle: "jonnn" },
      text:
        "Not every app needs parallax. Use it sparingly where it adds structure, like in headers.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      metrics: { likes: 120 },
      sentiment: "oppose",
      category: "think",
      reason: "Contrarian but thoughtful framing that reins in excess.",
    },
    {
      id: "1234567894",
      author: { name: "Milo", handle: "milo" },
      text: "Shipping icons with hinted pixels for crispness at common sizes.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      metrics: { likes: 88 },
      sentiment: "support",
      category: "comic",
      reason: "A lighter take that still carries truth.",
    },
  ],
  curator: "TweetCurator Team",
  createdAt: new Date().toISOString(),
  viewMode: "thread",
};

export const conversationsById: Record<string, Conversation> = {
  [demoConversation.id!]: demoConversation,
};
