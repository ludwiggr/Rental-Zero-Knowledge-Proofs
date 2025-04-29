const webpack = require('webpack');
const path = require('path');

module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          "path": require.resolve("path-browserify"),
          "fs": false,
          "crypto": require.resolve("crypto-browserify"),
          "stream": require.resolve("stream-browserify"),
          "os": require.resolve("os-browserify/browser"),
          "constants": path.resolve(__dirname, 'src/polyfills/constants.js'),
          "readline": false,
          "vm": require.resolve("vm-browserify"),
          "buffer": require.resolve("buffer/"),
        },
      },
    },
    plugins: {
      add: [
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        }),
        new webpack.DefinePlugin({
          'process.env': JSON.stringify(process.env),
          'process.version': JSON.stringify(process.version),
          'process.platform': JSON.stringify(process.platform),
          'process.arch': JSON.stringify(process.arch),
          'process.cwd': () => JSON.stringify(process.cwd()),
          'process': JSON.stringify({
            env: process.env,
            version: process.version,
            platform: process.platform,
            arch: process.arch,
            cwd: () => process.cwd(),
            nextTick: (fn) => setTimeout(fn, 0),
            browser: true,
            argv: [],
            module: { exports: {} },
          }),
        }),
      ],
    },
  },
}; 