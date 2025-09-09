export default {
  content: ["./**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#FAFAFA", text: "#1C1C1E", muted: "#6B7280",
        primary: "#3A0CA3", accent: "#FF3B81", highlight: "#FFD43B",
        card: "#FFFFFF", stroke: "#E5E7EB"
      },
      boxShadow: {
        card: "0 6px 24px rgba(0,0,0,.06)",
        retro: "4px 6px 0 #1C1C1E"
      },
      borderRadius: { xl: "14px" }
    }
  },
  plugins: []
}
