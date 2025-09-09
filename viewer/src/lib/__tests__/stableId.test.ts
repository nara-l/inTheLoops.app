import { stableCardId, replyCardId } from '../stableId'

describe('stableId utilities', () => {
  describe('stableCardId', () => {
    it('should generate consistent hash for same input', () => {
      const parts = ['john', '@john123', 'Hello world']
      const id1 = stableCardId(parts)
      const id2 = stableCardId(parts)
      
      expect(id1).toBe(id2)
      expect(id1).toMatch(/^s_[a-f0-9]{8}$/)
    })

    it('should generate different hashes for different inputs', () => {
      const parts1 = ['john', '@john123', 'Hello world']
      const parts2 = ['jane', '@jane456', 'Hello world']
      
      const id1 = stableCardId(parts1)
      const id2 = stableCardId(parts2)
      
      expect(id1).not.toBe(id2)
    })

    it('should filter out null/undefined values', () => {
      const parts1 = ['john', null, 'Hello world', undefined]
      const parts2 = ['john', 'Hello world']
      
      const id1 = stableCardId(parts1)
      const id2 = stableCardId(parts2)
      
      expect(id1).toBe(id2)
    })

    it('should handle empty array', () => {
      const id = stableCardId([])
      expect(id).toMatch(/^s_[a-f0-9]{8}$/)
    })

    it('should be consistent with order', () => {
      const parts1 = ['a', 'b', 'c']
      const parts2 = ['c', 'b', 'a']
      
      const id1 = stableCardId(parts1)
      const id2 = stableCardId(parts2)
      
      expect(id1).not.toBe(id2)
    })
  })

  describe('replyCardId', () => {
    it('should generate consistent ID for reply', () => {
      const id1 = replyCardId('John Doe', '@john', 'Great post!')
      const id2 = replyCardId('John Doe', '@john', 'Great post!')
      
      expect(id1).toBe(id2)
      expect(id1).toMatch(/^s_[a-f0-9]{8}$/)
    })

    it('should handle null values gracefully', () => {
      const id = replyCardId(null, null, null)
      expect(id).toMatch(/^s_[a-f0-9]{8}$/)
    })

    it('should generate different IDs for different authors', () => {
      const id1 = replyCardId('John', '@john', 'Hello')
      const id2 = replyCardId('Jane', '@john', 'Hello')
      
      expect(id1).not.toBe(id2)
    })
  })
})