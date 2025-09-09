// Simple OG generator (Node.js) - copies the base SVG and injects a title.
// Usage: node tools/og/generate.mjs "Title here"
import fs from 'node:fs';
const title = process.argv[2] ?? "You’re in the loops!";
let svg = fs.readFileSync('public/og/base.svg','utf8');
svg = svg.replace(/Curated replies, threads & comments—beautifully shared\./, title.slice(0,90));
fs.writeFileSync('public/og/out.svg', svg);
console.log('OG written to public/og/out.svg');
