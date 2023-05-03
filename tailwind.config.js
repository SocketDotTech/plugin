/** @type {import('tailwindcss').Config} */

function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined)
      return `rgba(var(${variableName}), ${opacityValue})`;
    else return `rgb(var(${variableName}))`;
  };
}

module.exports = {
  prefix: "skt-w-",
  enabled: process.env.NODE_ENV === "publish",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      textColor: {
        widget: {
          accent: withOpacity("--socket-widget-accent-color"),
          onAccent: withOpacity("--socket-widget-on-accent-color"),
          primary: withOpacity("--socket-widget-primary-text-color"),
          "primary-main": withOpacity("--socket-widget-primary-color"),
          secondary: withOpacity("--socket-widget-secondary-text-color"),
          outline: withOpacity("--socket-widget-outline-color"),
          "on-interactive": withOpacity("--socket-widget-on-interactive"),
        },
      },
      backgroundColor: {
        widget: {
          accent: withOpacity("--socket-widget-accent-color"),
          onAccent: withOpacity("--socket-widget-on-accent-color"),
          primary: withOpacity("--socket-widget-primary-color"),
          secondary: withOpacity("--socket-widget-secondary-color"),
          outline: withOpacity("--socket-widget-outline-color"),
          interactive: withOpacity("--socket-widget-interactive"),
          "secondary-text": withOpacity("--socket-widget-secondary-text-color"),
        },
      },
      borderColor: {
        widget: {
          accent: withOpacity("--socket-widget-accent-color"),
          primary: withOpacity("--socket-widget-primary-color"),
          secondary: withOpacity("--socket-widget-secondary-color"),
          "secondary-text": withOpacity("--socket-widget-secondary-text-color"),
          outline: withOpacity("--socket-widget-outline-color"),
        },
      },
      width: {
        5.5: "1.375rem",
        6.5: "1.625rem",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
