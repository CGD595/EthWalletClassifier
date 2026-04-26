export default function EthGlyph({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path d="M32 4 L32 26 L52 32 Z" fill="#8a92b2" />
      <path d="M32 4 L12 32 L32 26 Z" fill="#c5cce0" />
      <path d="M32 60 L32 38 L52 32 Z" fill="#8a92b2" opacity="0.7" />
      <path d="M32 60 L12 32 L32 38 Z" fill="#c5cce0" opacity="0.85" />
      <path d="M32 34 L52 32 L32 44 L12 32 Z" fill="#5a6383" />
    </svg>
  );
}
