const withAntdLess = require('next-plugin-antd-less');

let config =  withAntdLess({
    // optional
    // modifyVars: { '@primary-color': '#04f' },
    // optional
    lessVarsFilePath: './styles/variables.less',
    // optional https://github.com/webpack-contrib/css-loader#object
    cssLoaderOptions: {},

    // Other Config Here...
    javascriptEnabled: true,
    
    lessOptions: {
      modifyVars: getThemeVariables({
        dark: true,
        compact: true,
      }),
      localIdentName: '[path][name]__[local]--[hash:base64:5]',
    },

    webpack(config) {
        return config;
    },

});


module.exports = config