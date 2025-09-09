export type Author = {
  name: string;
  handle: string;
};

export type Metrics = {
  likes?: number;
  replies?: number;
  reposts?: number;
  bookmarks?: number;
};

export type TweetLike = {
  id?: string | null;
  author: Author;
  text: string;
  timestamp?: string | null;
  metrics?: Metrics;
  sentiment?: "support" | "oppose" | "neutral";
  category?: "hot" | "cold" | "comic" | "think"; // curation badge
  featured?: boolean; // larger visual weight
  parentId?: string | null; // reply threading
  reason?: string; // why curator picked it
  media?: {
    type: "image" | "video";
    provider?: "twitter" | "other";
    sourceUrl?: string; // original URL (for provenance/fallback)
    url?: string; // rehosted Blob URL (preferred)
    width?: number;
    height?: number;
    aspectRatio?: string; // e.g., "16/9"
    alt?: string;
  } | null;
};

export type Conversation = {
  id?: string | null;
  url?: string;
  original: TweetLike | null;
  replies: TweetLike[];
  curator?: string | null;
  createdAt?: string;
  viewMode?: "thread" | "card";
  subject?: string; // curated subject/topic
  platform?: "twitter" | "youtube" | "reddit" | "other";
};
