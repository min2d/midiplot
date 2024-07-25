const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { VueLoaderPlugin } = require('vue-loader')


module.exports = {
  mode: 'development',
  entry: {
    index: './src/main.js'
  },
  output: {
    path: `${__dirname}/docs`,
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      }, {
        test: /\.vue$/,
        loader: 'vue-loader'
      }

    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style.css'
    }),
    new VueLoaderPlugin()
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  }
}