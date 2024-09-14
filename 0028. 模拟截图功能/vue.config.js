const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  pages: {
    index: {
      entry: 'src/renderer/main.js',
    },
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      mainProcessFile: 'src/main/index.js',
      mainProcessWatch: ['src/main'],
    },
  },
  configureWebpack: {
    resolve: {
      fallback: {
        fs: false,
        path: require.resolve('path-browserify'),
      },
    },
  },
});