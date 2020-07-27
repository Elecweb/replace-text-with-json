const path = require("path");

module.exports = {
  mode: "production",
  entry: "./task/task.js",
  target: "node",
  output: {
    path: path.resolve(__dirname, "task"),
    filename: "index.js",
  },
};
