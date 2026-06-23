const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = (env = {}, argv = {}) => {
  const isDev = argv.mode === 'development' || process.env.NODE_ENV === 'development';
  const isAnalyze = Boolean(env.analyze);
  const fileName = (folder, ext) => isDev ? `${folder}/[name].${ext}` : `${folder}/[name].[contenthash].${ext}`;

  const styleLoaders = (extraLoader) => {
    const loaders = [
      isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
      'css-loader',
    ];

    if (extraLoader) {
      loaders.push(extraLoader);
    }

    return loaders;
  };

  const plugins = [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html',
      favicon: './assets/images/webpack-cube.png',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/assets/images/webpack-cube.png'),
          to: path.resolve(__dirname, 'dist/assets/static/webpack-cube.png'),
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: fileName('css', 'css'),
    }),
    new ESLintPlugin({
      extensions: ['js'],
      exclude: 'node_modules',
    }),
  ];

  if (isAnalyze) {
    plugins.push(new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: 'report.html',
    }));
  }

  return {
    context: path.resolve(__dirname, 'src'),
    mode: isDev ? 'development' : 'production',
    entry: {
      main: './js/index.js',
      metrics: './ts/buildMetrics.ts',
    },
    target: 'web',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: fileName('js', 'js'),
      assetModuleFilename: 'assets/[name].[contenthash][ext]',
      clean: false,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@assets': path.resolve(__dirname, 'src/assets'),
        '@styles': path.resolve(__dirname, 'src/styles'),
        '@modules': path.resolve(__dirname, 'src/js/modules'),
      },
      extensions: ['.js', '.ts', '.json'],
    },
    devtool: isDev ? 'source-map' : false,
    devServer: {
      static: path.resolve(__dirname, 'dist'),
      port: 3500,
      hot: false,
      liveReload: true,
      open: false,
      historyApiFallback: true,
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            enforce: true,
            minSize: 0,
          },
        },
      },
      minimizer: [
        new CssMinimizerPlugin(),
        new TerserPlugin(),
      ],
    },
    plugins,
    module: {
      rules: [
        { test: /\.m?js$/, exclude: /node_modules/, use: 'babel-loader' },
        { test: /\.ts$/, exclude: /node_modules/, use: 'babel-loader' },
        { test: /\.css$/i, use: styleLoaders() },
        { test: /\.less$/i, use: styleLoaders('less-loader') },
        { test: /\.s[ac]ss$/i, use: styleLoaders('sass-loader') },
        {
          test: /\.(png|svg|jpg|jpeg|gif|webp|ico)$/i,
          type: 'asset/resource',
          generator: { filename: 'assets/images/[name].[contenthash][ext]' },
        },
        {
          test: /\.(woff|woff2|ttf|eot)$/i,
          type: 'asset/resource',
          generator: { filename: 'assets/fonts/[name].[contenthash][ext]' },
        },
      ],
    },
  };
};
