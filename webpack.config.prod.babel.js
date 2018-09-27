import webpack from 'webpack';
import path from 'path';

const supportedBrowsers = ['> 0.5%', 'last 2 versions', 'not ie <= 10'];

module.exports = () => {
  return {
    context: path.resolve(__dirname, 'src'),

    entry: {
      main: './parallax.js',
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
    },

    watch: false,

    devtool: false,

    module: {
      rules: [
        {
          test: /\.js$/,
          include: path.resolve(__dirname, 'src/js'),
          enforce: 'pre',
          loader: 'import-glob',
        },
        {
          test: /\.js$/,
          include: path.resolve(__dirname, 'src/js'),
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
                plugins: ['transform-runtime'],
              },
            },
            {
              loader: 'eslint-loader',
              options: {
                cache: true,
                emitWarning: true,
                configFile: '.eslintrc.json',
                ignorePath: '.eslintignore',
              },
            },
          ],
        },
      ],
    },

    externals: {
      jquery: 'jQuery',
    },

    plugins: [
      new webpack.DefinePlugin({
        LANG: JSON.stringify('en'),
      }),

      new webpack.optimize.SplitChunksPlugin({
        name: 'common',
      }),
    ],
  };
};
