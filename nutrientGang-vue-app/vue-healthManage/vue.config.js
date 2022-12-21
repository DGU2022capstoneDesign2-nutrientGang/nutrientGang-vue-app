const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],

  runtimeCompiler : true,

  devServer: {
    //proxy: 'http://localhost:3000'
    proxy : 'http://54.180.116.95:3000'
  }
})
