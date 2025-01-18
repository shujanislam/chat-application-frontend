module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Scan all files in the src directory
  ],
  theme: {
    extend: {
      colors: {
        catppuccin: {
          // Define the "mocha" palette (you can add other flavors like "latte" or "frappe" similarly)
          rosewater: '#f5e0dc',
          flamingo: '#f2cdcd',
          pink: '#f5c2e7',
          mauve: '#cba6f7',
          red: '#f38ba8',
          maroon: '#eba0ac',
          peach: '#fab387',
          yellow: '#f9e2af',
          green: '#a6e3a1',
          teal: '#94e2d5',
          blue: '#89b4fa',
          sky: '#89dceb',
          lavender: '#b4befe',
          text: '#cdd6f4', // Foreground text
          base: '#1e1e2e', // Background
          mantle: '#181825',
          crust: '#11111b',
        },
      },
    },
  },
  plugins: [],
};

