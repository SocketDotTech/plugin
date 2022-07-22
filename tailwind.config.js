/** @type {import('tailwindcss').Config} */


module.exports = {
  enabled: process.env.NODE_ENV === "publish",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      textColor: {
        widget: {
          accent: "var(--socket-widget-accent-color)",
          onAccent: "var(--socket-widget-on-accent-color)",
          primary: "var(--socket-widget-primary-text-color)",
          'primary-main':"var(--socket-widget-primary-color)",
          secondary: "var(--socket-widget-secondary-text-color)",
          outline: "var(--socket-widget-outline-color)",
          'on-interactive': "var(--socket-widget-on-interactive)"
        },
      },
      backgroundColor: {
        widget: {
          accent: "var(--socket-widget-accent-color)",
          primary: "var(--socket-widget-primary-color)",
          secondary: "var(--socket-widget-secondary-color)",
          outline: "var(--socket-widget-outline-color)",
          interactive: 'var(--socket-widget-interactive)'
        },
      },
      borderColor: {
        widget: {
          accent: "var(--socket-widget-accent-color)",
          primary:"var(--socket-widget-primary-color)",
          secondary: "var(--socket-widget-secondary-color)",
          "secondary-text": "var(--socket-widget-secondary-text-color)",
          outline: "var(--socket-widget-outline-color)",
        },
      },
      width: {
        5.5: "1.375rem",
      },
    },
  },
  plugins: [],
};
