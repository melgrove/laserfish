//webpack.config.js

module.exports = {
  mode: "production",
  entry: {
    main: "./src/webWorkerInterface.ts",
  },
  output: {
    path: (__dirname + '/export'),
    filename: "laserfish.js",
    libraryTarget: 'self', // 'self' instead of 'window' because in web worker
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      { 
        test: /\.tsx?$/,
        loader: "ts-loader"
      }
    ]
  }
};