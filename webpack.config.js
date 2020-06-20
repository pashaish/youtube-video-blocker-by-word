const path = require('path');
module.exports = {
  entry: {
    bundle: path.join(__dirname, 'src', 'index.ts'),
    poppup: path.join(__dirname, 'src', 'poppup.tsx')
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: "[name].js",
  },
  module: {
    rules: [{
      test: /.tsx?$/,
      loader: 'ts-loader',
    }]
  },
  resolve: {
    extensions: ['.json', '.js', '.jsx', '.ts', '.tsx']
  },
  devtool: 'source-map',
};