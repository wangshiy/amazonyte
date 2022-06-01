// https://github.com/ChainSafe/web3.js#web3-and-create-react-app
const webpack = require("webpack");
const {
  override,
  addWebpackModuleRule,
  addWebpackPlugin,
  fixBabelImports,
} = require("customize-cra");
// https://github.com/xyy94813/customize-cra-less-loader
const addLessLoader = require("customize-cra-less-loader");
const ArcoWebpackPlugin = require("@arco-design/webpack-plugin");

const addCustomize = () => (config) => {
  // If you want to hide the warnings created by the console:
  config.ignoreWarnings = [/Failed to parse source map/];
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
    assert: require.resolve("assert"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    os: require.resolve("os-browserify"),
    url: require.resolve("url"),
  });
  config.resolve.fallback = fallback;
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ]);
  return config;
};

module.exports = override(
  addLessLoader(),
  addWebpackModuleRule({
    test: /\.svg$/,
    loader: "@svgr/webpack",
  }),
  addWebpackPlugin(new ArcoWebpackPlugin()),
  fixBabelImports("arco", {
    libraryName: "@arco-design/web-react",
    libraryDirectory: "es",
    camel2DashComponentName: false,
    style: true, // 样式按需加载
  }),
  fixBabelImports(
    "arco-icon", // 重点是为每个config加了个name，如上所示的两个import开头行末尾的"arco"和"arco-icon”。否则会报如下错误
    {
      libraryName: "@arco-design/web-react/icon",
      libraryDirectory: "react-icon",
      camel2DashComponentName: false,
      style: false,
    }
  ),
  addCustomize()
);
