/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  
  theme: {
    
    extend: {
      
      colors:{
        "primary":"#25CBD4",
        "secondary":"#FE8278",
        "text-color":"#071021",
        "text-gray":"#7a7e83"
      },
      boxShadow: {
        custom: '0 3px 20px #0000001a',
        formFeilds:"0 3px 6px #00000005",
        btnShadow:"0 7px 16px #25cbd433"
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "overlay":"linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 61.08%)"
      },
    },
  },
  plugins: [],
};
