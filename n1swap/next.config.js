const withAntdLess = require('next-plugin-antd-less');

let config =  withAntdLess({
    // optional
    // modifyVars: { '@primary-color': '#04f' },
    // optional
    lessVarsFilePath: './styles/variables.less',
    // optional https://github.com/webpack-contrib/css-loader#object
    cssLoaderOptions: {

      less: {
        lessOptions: { // important extra layer for less-loader^6.0.0
          javascriptEnabled: true
        }
      }

        
    },

    // Other Config Here...

    webpack(config) {
        return config;
    },

});


module.exports = config