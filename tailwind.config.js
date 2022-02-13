module.exports = {
  content: ["./screens/**/*.{html,tsx,ts}", "App.tsx", "./components/**/*.{html,tsx,ts}"],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: require('tailwind-rn/unsupported-core-plugins'),
}
