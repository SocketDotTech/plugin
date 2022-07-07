/** @type {import('tailwindcss').Config} */
module.exports = {
  enabled: process.env.NODE_ENV === "publish",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      textColor: {
        widget: {
          theme: `rgb(var(--theme-color))`,
          primary: "var(--primary-text-color)",
          'primary-inverted': "var(--primary-color)",
          secondary: ({opacityValue}) => {
            if(opacityValue !== undefined) {
              return `rgba(var(--secondary-text-color), ${opacityValue})`;
            }
            return `rgba(var(--secondary-text-color))`
          },
          outline: "var(--outline-color)",
        },
      },
      backgroundColor: {
        widget: {
          theme: ({ opacityValue }) => {
            if (opacityValue !== undefined) {
              return `rgba(var(--theme-color), ${opacityValue})`;
            }
            return `rgb(var(--theme-color))`;
          },
          'theme-muted': 'var(--theme-muted-color)',
          primary: "var(--primary-color)",
          secondary: "var(--secondary-color)",
          outline: "var(--outline-color)",
        },
      },
      borderColor: {
        widget: {
          theme: `rgb(var(--theme-color))`,
          // primary: "var(--primary-text-color)",
          secondary: "var(--secondary-color)",
          'secondary-text': ({opacityValue}) => {
            if(opacityValue !== undefined) {
              return `rgba(var(--secondary-text-color), ${opacityValue})`;
            }
            return `rgba(var(--secondary-text-color))`
          },
          outline: "var(--outline-color)",
        },
      },
      width: {
        5.5: "1.375rem",
      },
    },
  },
  plugins: [],
};
