module.exports = {
  presets: [['next/babel']],
  plugins: [
    'inline-json-import',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-function-bind'],
    ['import', { libraryName: 'antd', style: true }]
  ],
};