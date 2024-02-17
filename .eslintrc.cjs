module.exports = {
  extends: ['mantine'],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'no-param-reassign': 'off',
    'import/no-cycle': 'off',
    'import/extensions': 'off',
  },
};
