module.exports = {
  '**/*.{js, jsx}': [
    'eslint --fix',
  ],
  '**/*.{md,yml,json}': [
    'prettier --write',
  ],
};
