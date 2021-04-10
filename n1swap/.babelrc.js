module.exports = {
  presets: [['next/babel']],
  plugins: [
    'inline-json-import',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['import', { libraryName: 'antd', style: true }]
  ],
};