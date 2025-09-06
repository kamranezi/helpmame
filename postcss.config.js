/** @type {import('postcss').Config} */
module.exports = {
  plugins: {
  '@tailwindcss/postcss': {},
  autoprefixer: {},
  'postcss-preset-env': { stage: 3 },
}
}
