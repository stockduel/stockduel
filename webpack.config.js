module.exports = {

  entry: './client/app/index.jsx',
  output: {
    path: './client/dist',
    publicPath: './client/dist',
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
    }]
  },
};
