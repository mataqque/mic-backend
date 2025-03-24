module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		tsconfigRootDir: __dirname,
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint/eslint-plugin'],
	extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended', 'eslint-config-prettier'],
	root: true,
	env: {
		node: true,
		jest: true,
	},

	ignorePatterns: ['.eslintrc.js'],
	rules: {
		'react/react-in-jsx-scope': 'off',
		'@typescript-eslint/no-unsafe-assignment': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-unsafe-member-access': 'off',
		'@typescript-eslint/no-require-imports': 'off',
		indent: ['error', 'tab'],
		'prettier/prettier': ['error', { endOfLine: 'auto' }],
	},
};
