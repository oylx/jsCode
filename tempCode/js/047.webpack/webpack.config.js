const path = require('path');

module.exports = {
  entry: './src/js/app.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist/js')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      },
      {
        test: /\.scss$/,
        use: [{ loader:'style-loader'}, 
              { loader: 'css-loader', options: { importLoaders: 1 } }, 
              {
                loader: 'postcss-loader'
              },
              { loader:'sass-loader'}]
      }
    ]
  }
};
