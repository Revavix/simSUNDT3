/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        simsundt: {
          "primary": "#f59e0b",
          "secondary": "#44403c", // d6d3d1 #292524
          "accent": "#0891b2", 
          "neutral": "#a8a29e", 
          "base-100": "#d6d3d1",
          "info": "#0000ff",
          "success": "#22c55e",
          "warning": "#ef4444",
          "error": "#ef4444",
        },
      },
      "corporate",
      "business"
    ]
  },
}
