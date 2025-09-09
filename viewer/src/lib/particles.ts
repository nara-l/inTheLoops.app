export type ReactionLabel = 'FIRE' | 'DEAD' | 'FACTS' | 'BOOM' | 'CRYING' | 'BLOWN' | 'HEART';

let layerEl: HTMLDivElement | null = null;

export function ensureParticleLayer(): HTMLDivElement {
  if (!layerEl) {
    layerEl = document.createElement('div');
    layerEl.className = 'particle-layer';
    document.body.appendChild(layerEl);
  }
  return layerEl;
}

export function spawnParticles(x: number, y: number, reaction: ReactionLabel) {
  // Always animate for this product experience.
  const layer = ensureParticleLayer();
  const count = ({ BOOM: 18, FIRE: 14, DEAD: 10, FACTS: 12, CRYING: 12, BLOWN: 12, HEART: 14 } as const)[reaction] || 12;
  const palette = ({
    FIRE: ['#FF5722', '#FF9800', '#FFC107'],
    DEAD: ['#888', '#666', '#aaa'],
    FACTS: ['#FFD700', '#FFF176', '#FFECB3'],
    BOOM: ['#FF1744', '#FF5252', '#FF8A80'],
    CRYING: ['#2196F3', '#03A9F4', '#00BCD4'],
    BLOWN: ['#FFFFFF', '#E0F2F1', '#FFCDD2'],
    HEART: ['#FF4D6D', '#FF6B6B', '#FFD6E0'],
  } as const)[reaction] as unknown as string[] || ['#999'];
  const emojiSet = ({
    FIRE: ['🔥', '✨'],
    DEAD: ['👀', '✖️'],
    FACTS: ['🎯', '✨', '⭐'],
    BOOM: ['💥', '⭐', '✨'],
    CRYING: ['💧', '😢'],
    BLOWN: ['🤯', '⚡'],
    HEART: ['❤️', '✨'],
  } as const)[reaction] as unknown as string[] || ['✨'];

  const distanceFactors: Partial<Record<ReactionLabel, number>> = { BOOM: 90, FIRE: 70 };
  const yFactors: Partial<Record<ReactionLabel, number>> = { CRYING: 1.4, FIRE: 0.7 };

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'particle';
    const useEmoji = i % 2 === 0;
    if (useEmoji) {
      el.textContent = emojiSet[Math.floor(Math.random() * emojiSet.length)];
      el.style.fontSize = `${12 + Math.random() * 6}px`;
    } else {
      el.classList.add('circle');
      el.style.setProperty('--color', palette[Math.floor(Math.random() * palette.length)]);
    }
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    const angle = Math.random() * Math.PI * 2;
    const distance = 40 + Math.random() * (distanceFactors[reaction] ?? 60);
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance * (yFactors[reaction] ?? 1);
    const rot = `${(Math.random() * 120) - 60}deg`;
    const dur = `${450 + Math.random() * 450}ms`;
    el.style.setProperty('--dx', `${dx}px`);
    el.style.setProperty('--dy', `${dy}px`);
    el.style.setProperty('--rot', rot);
    el.style.setProperty('--dur', dur);
    layer.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }
}
