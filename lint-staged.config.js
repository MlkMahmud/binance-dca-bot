const tscFlags = [
  '--target es5',
  '--allowJs',
  '--skipLibCheck',
  '--strict',
  '--forceConsistentCasingInFileNames',
  '--noEmit',
  '--esModuleInterop',
  '--module commonjs',
  '--moduleResolution node',
  '--resolveJsonModule',
  '--isolatedModules',
  '--noImplicitAny',
  '--jsx preserve',
  '--allowSyntheticDefaultImports',
];

module.exports = {
  '**/*.{ts, tsx, js, jsx}': [
    (files) =>
      `tsc ${tscFlags.join(' ')} ${files.map((file) => `'${file}'`).join(' ')}`,
    'eslint --fix',
  ],
  '**/*.{md,yml,json,prettierrc}': ['prettier --write'],
};
