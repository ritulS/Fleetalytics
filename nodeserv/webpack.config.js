const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    index: "./index.tsx",
    analytics: "./analytics.tsx",
    status: "./status.tsx",
  },
  output: {
    path: path.resolve(__dirname, "./public"),
    filename: "[name]_bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.(tsx)$/,
        exclude: /node_modules/,
        use: ["ts-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx"],
  },
};
