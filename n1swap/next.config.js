const withAntdLess = require('next-plugin-antd-less');

let config =  withAntdLess({
    // optional
    modifyVars: { 
        '@primary-color': '#3E2EAF',
        '@link-color': '#3E2EAF',
        '@text-color': 'rgba(0, 0, 0, 0.65)',
        '@border-radius-base' : '4px',
        
    },
    // optional
    // lessVarsFilePath: './styles/variables.less',
    // optional https://github.com/webpack-contrib/css-loader#object
    cssLoaderOptions: {},
    // Other Config Here...

    webpack(config) {
        return config;
    },

});

let global_config = null
if (process.env.NODE_ENV === 'production') {
    global_config = require('./config/production.js')
}else {
    global_config = require('./config/dev.js')
}


// console.log('finnal_config',Object.assign(config,global_config));

module.exports = Object.assign(config,global_config)