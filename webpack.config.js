module.exports = {

  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    './client/app/index.jsx'],
  output: {
    path: './dist',
    publicPath: 'dist',
    filename: 'bundle.js',
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['react', 'es2015'],
      },
    },
    {
      test: /\.css$/,
      loader: "style-loader!css-loader"
    }]
  },
};
