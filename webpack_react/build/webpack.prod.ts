import path from "path";
import { Configuration } from "webpack";
import { merge } from "webpack-merge";
import CopyPlugin from "copy-webpack-plugin";
import baseConfig from "./webpack.base";
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import CompressionPlugin from "compression-webpack-plugin";
const globAll = require("glob-all");
const { PurgeCSSPlugin } = require("purgecss-webpack-plugin");

const prodConfig: Configuration = merge(baseConfig, {
  mode: "production", // 生产模式,会开启tree-shaking和压缩代码,以及其他优化
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "../public"), // 复制public下文件
          to: path.resolve(__dirname, "../dist"), // 复制到dist目录中
          filter: (source) => !source.includes("index.html"), // 忽略index.html
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: "static/css/[name].css", // 抽离css的输出目录和名称
    }),
    new CompressionPlugin({
      test: /\.(js|css)$/, // 只生成css,js压缩文件
      filename: "[path][base].gz", // 文件命名
      // algorithm: 'gzip', // 压缩格式,默认是gzip
      // threshold: 10240, // 只有大小大于该值的资源会被处理。默认值是 10k
      minRatio: 0.8, // 压缩率,默认值是 0.8
    }),
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[contenthash:8].css",
    }),
    new PurgeCSSPlugin({
      paths: globAll.sync(
        [
          `${path.join(__dirname, "../src")}/**/*`,
          path.join(__dirname, "../public/index.html"),
        ],
        {
          nodir: true,
        },
      ),
      only: ["dist"],
      safelist: {
        standard: [/^ant-/], // 过滤以ant-开头的类名，哪怕没用到也不删除
      },
    }),
    new CompressionPlugin({
      test: /.(js|css)$/, // 只生成css,js压缩文件
      filename: "[path][base].gz", // 文件命名
      algorithm: "gzip", // 压缩格式,默认是gzip
      threshold: 10240, // 只有大小大于该值的资源会被处理。默认值是 10k
      minRatio: 0.8, // 压缩率,默认值是 0.8
    }),
  ],
  optimization: {
    runtimeChunk: {
      name: "mainifels",
    },
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(), // 压缩css
      new TerserPlugin({
        parallel: true, // 开启多线程压缩
        terserOptions: {
          compress: {
            pure_funcs: ["console.log"], // 删除console.log
          },
        },
      }),
    ],
  },
  performance: {
    // 配置与性能相关的选项的对象
    hints: false, // 设置为false将关闭性能提示。默认情况下，Webpack会显示有关入口点和资产大小的警告和错误消息。将hints设置为false可以禁用这些消息。
    maxAssetSize: 4000000, // 设置一个整数，表示以字节为单位的单个资源文件的最大允许大小。如果任何资源的大小超过这个限制，Webpack将发出性能警告。在你提供的配置中，这个值被设置为4000000字节（约4MB）。
    maxEntrypointSize: 5000000, // 设置一个整数，表示以字节为单位的入口点文件的最大允许大小。入口点是Webpack构建产生的主要JS文件，通常是应用程序的主要代码。如果入口点的大小超过这个限制，Webpack将发出性能警告。在你提供的配置中，这个值被设置为5000000字节（约5MB）。
  },
});
export default prodConfig;
