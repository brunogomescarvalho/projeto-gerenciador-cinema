const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {

  // O ponto de entrada da aplicação
  entry: {
    index: path.resolve(__dirname, 'src/views', 'home', 'home.ts'),
    detalhes: path.resolve(__dirname, 'src/views', 'detalhes', 'detalhes.ts'),
    telaBase: path.resolve(__dirname, 'src/views', 'compartilhado', 'tela-base.ts'),
    telaFilmes: path.resolve(__dirname, 'src/views', 'filmes', 'tela-filmes.ts'),
    telaSeries: path.resolve(__dirname, 'src/views', 'series', 'tela-series.ts'),
    telaFavoritos: path.resolve(__dirname, 'src/views', 'favoritos', 'tela-favoritos.ts'),
  },

  // Configuração de output do build
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },

  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },

    ]
  },

  // aliases
  resolve: {
    extensions: ['.ts', '.js', '.css'],

    alias: {
      assets: path.resolve(__dirname, 'src/assets')
    }
  },

  plugins: [

    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'src/views', 'home', 'home.html'),
      chunks: ['index']
    }),

    new HtmlWebpackPlugin({
      filename: 'detalhes.html',
      template: path.resolve(__dirname, 'src/views', 'detalhes', 'detalhes.html'),
      chunks: ['detalhes']
    }),

    new HtmlWebpackPlugin({
      filename: 'tela-filmes.html',
      template: path.resolve(__dirname, 'src/views', 'filmes', 'tela-filmes.html'),
      chunks: ['telaFilmes'],
    }),

    new HtmlWebpackPlugin({
      filename: 'tela-series.html',
      template: path.resolve(__dirname, 'src/views', 'series', 'tela-series.html'),
      chunks: ['telaSeries']
    }),
    new HtmlWebpackPlugin({
      filename: 'tela-favoritos.html',
      template: path.resolve(__dirname, 'src/views', 'favoritos', 'tela-favoritos.html'),
      chunks: ['telaFavoritos']
    }),

    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/assets', to: 'assets' }
      ]
    })
  ],

  // Ambiente de desenvolvimento
  devtool: 'source-map',

  devServer: {
    liveReload: true,
    port: 8080,
    static: {
      directory: path.resolve(__dirname, 'dist')
    },
    watchFiles: {
      paths: ['src']
    }
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
};