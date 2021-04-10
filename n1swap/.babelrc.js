module.exports = {
  presets: [['next/babel']],
  plugins: [
    ['import', { libraryName: 'antd', style: true }],
    'inline-json-import',
    ['@babel/plugin-proposal-decorators', { legacy: true }]
  ],
};