module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve = webpackConfig.resolve || {};
      webpackConfig.resolve.fallback = {
        ...(webpackConfig.resolve.fallback || {}),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        stream: require.resolve('stream-browserify'),
        zlib: require.resolve('browserify-zlib'),
        util: require.resolve('util/'),
        url: require.resolve('url/'),
        crypto: require.resolve('crypto-browserify'),
        assert: require.resolve('assert/'),
      };

      return webpackConfig;
    }
  }
};
