/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Metropolis', 'sans-serif'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primaryButton: '#04436F',
      },
      borderRadius: {
        custom: '50px 0px 0px 50px',
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(93deg, #04436F 0%, rgba(0, 0, 0, 0) 100%)',
        'gradient-to-r': 'linear-gradient(93deg, #B2EAFF 0%, rgba(0, 0, 0, 0.00) 100%)',

      },
    },
  },
  plugins: [],
};
