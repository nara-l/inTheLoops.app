/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Conversation, TweetLike } from "@/lib/types";

export function mapBangToConversation(input: any): Conversation {
  const origAuthorName = input?.original?.author?.name || input?.original?.author || input?.original?.authorName || 'Unknown';
  const origHandle = input?.original?.handle || input?.original?.author?.handle || ('@' + String(origAuthorName).replace(/\s+/g, ''));
  const origContent = input?.original?.content || input?.original?.text || input?.original?.tweet || '';

  const replies = Array.isArray(input?.replies) ? input.replies : [];
  const mappedReplies: TweetLike[] = replies.map((reply: any) => {
    const rAuthor = reply?.author?.name || reply?.author || reply?.authorName || 'Anon';
    const rHandle = reply?.handle || reply?.author?.handle || '';
    const rContent = reply?.content || reply?.text || '';
    return {
      id: reply?.id ?? null,
      author: { name: String(rAuthor), handle: String(rHandle).replace(/^@/, '') },
      text: String(rContent),
    };
  });

  return {
    id: input?.id ?? null,
    url: input?.url ?? undefined,
    original: {
      id: input?.original?.id ?? null,
      author: { name: String(origAuthorName), handle: String(origHandle).replace(/^@/, '') },
      text: String(origContent),
      media: input?.original?.media ? {
        type: input.original.media.type || 'image',
        provider: input.original.media.provider || 'twitter',
        sourceUrl: input.original.media.sourceUrl || input.original.media.url || undefined,
        url: input.original.media.url || input.original.media.sourceUrl || undefined,
        width: input.original.media.width || undefined,
        height: input.original.media.height || undefined,
        aspectRatio: input.original.media.aspectRatio || undefined,
        alt: input.original.media.alt || ''
      } : null,
    },
    replies: mappedReplies,
    curator: input?.curator ?? null,
    createdAt: input?.createdAt ?? new Date().toISOString(),
    viewMode: input?.viewMode ?? 'thread',
    subject: input?.subject ?? undefined,
    platform: 'twitter',
  };
}
