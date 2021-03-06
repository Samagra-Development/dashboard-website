const workboxPlugin = require('workbox-webpack-plugin')
const path = require('path')

module.exports = {
    webpack: function(config, env) {
        if (env === 'production') {
            const workboxConfigProd = {
              swSrc: path.join(__dirname, 'public', 'custom-service-worker.js'),
              swDest: 'custom-service-worker.js',
              importWorkboxFrom: 'disabled'
            }
            config = removeSWPrecachePlugin(config)
            config.plugins.push(new workboxPlugin.InjectManifest(workboxConfigProd))
        }
        return config
    }, 
    jest: function(config) {
        return config
    },
    devServer: function(configFunction) {
        console.log(configFunction.toString())
        return function (proxy, allowedHost) {
            console.log(proxy, allowedHost)
            const config = configFunction(proxy, allowedHost)
            return config;
        }
    }
}

function removeSWPrecachePlugin (config) {
    const swPrecachePluginIndex = config.plugins.findIndex((element) => {
      return element.constructor.name === 'SWPrecacheWebpackPlugin'
    })
    if (swPrecachePluginIndex !== -1) {
      config.plugins.splice(swPrecachePluginIndex, 1)
    }
    return config;
}