import { mapBangToConversation } from '../mapBang'
import type { Conversation } from '../types'

describe('mapBangToConversation', () => {
  it('should map basic input correctly', () => {
    const input = {
      id: 'test123',
      original: {
        author: { name: 'John Doe', handle: '@johndoe' },
        text: 'This is a test tweet'
      },
      replies: []
    }

    const result = mapBangToConversation(input)

    expect(result).toEqual({
      id: 'test123',
      url: undefined,
      original: {
        id: null,
        author: { name: 'John Doe', handle: 'johndoe' },
        text: 'This is a test tweet',
        media: null
      },
      replies: [],
      curator: null,
      createdAt: expect.any(String),
      viewMode: 'thread',
      subject: undefined,
      platform: 'twitter'
    })
  })

  it('should handle missing/malformed original author', () => {
    const input = {
      original: {
        text: 'Test tweet'
      },
      replies: []
    }

    const result = mapBangToConversation(input)

    expect(result.original.author).toEqual({
      name: 'Unknown',
      handle: 'Unknown'
    })
  })

  it('should map replies correctly', () => {
    const input = {
      original: {
        author: { name: 'Original Author', handle: '@orig' },
        text: 'Original tweet'
      },
      replies: [
        {
          id: 'reply1',
          author: { name: 'Reply Author', handle: '@reply' },
          text: 'This is a reply'
        },
        {
          author: 'Just Name', // String format
          text: 'Another reply'
        }
      ]
    }

    const result = mapBangToConversation(input)

    expect(result.replies).toHaveLength(2)
    expect(result.replies[0]).toEqual({
      id: 'reply1',
      author: { name: 'Reply Author', handle: 'reply' },
      text: 'This is a reply'
    })
    expect(result.replies[1]).toEqual({
      id: null,
      author: { name: 'Just Name', handle: '' },
      text: 'Another reply'
    })
  })

  it('should handle media correctly', () => {
    const input = {
      original: {
        author: { name: 'User', handle: '@user' },
        text: 'Tweet with image',
        media: {
          type: 'image',
          url: 'https://example.com/image.jpg',
          width: 800,
          height: 600
        }
      },
      replies: []
    }

    const result = mapBangToConversation(input)

    expect(result.original.media).toEqual({
      type: 'image',
      provider: 'twitter',
      sourceUrl: 'https://example.com/image.jpg',
      url: 'https://example.com/image.jpg',
      width: 800,
      height: 600,
      aspectRatio: undefined,
      alt: ''
    })
  })

  it('should sanitize @ handles', () => {
    const input = {
      original: {
        author: { name: 'User', handle: '@@@multiple@signs@' },
        text: 'Test'
      },
      replies: [{
        author: { name: 'Reply', handle: '@reply@' },
        text: 'Reply text'
      }]
    }

    const result = mapBangToConversation(input)

    expect(result.original.author.handle).toBe('@@multiple@signs@')
    expect(result.replies[0].author.handle).toBe('reply@')
  })

  it('should handle various input formats for content', () => {
    const input = {
      original: {
        author: 'String Author',
        content: 'Using content field', // Alternative field name
        authorName: 'Alternative Author Name'
      },
      replies: []
    }

    const result = mapBangToConversation(input)

    expect(result.original.text).toBe('Using content field')
    expect(result.original.author.name).toBe('String Author')
  })

  it('should provide default values for missing fields', () => {
    const result = mapBangToConversation({})

    expect(result).toEqual({
      id: null,
      url: undefined,
      original: {
        id: null,
        author: { name: 'Unknown', handle: 'Unknown' },
        text: '',
        media: null
      },
      replies: [],
      curator: null,
      createdAt: expect.any(String),
      viewMode: 'thread',
      subject: undefined,
      platform: 'twitter'
    })
  })
})