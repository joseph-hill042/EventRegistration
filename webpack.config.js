/**
 * Environment variables used in this configuration:
 * NODE_ENV
 * SERVER_URL
 * GMAP_KEY
 */

require('dotenv').config();
const webpack = require('webpack');
const glob = require('glob-all');
const path = require('path');
const fs = require('fs');
const PurifyCSSPlugin = require('purifycss-webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

/**
 * flag Used to check if the environment is production or not
 */
const isProduction = (process.env.NODE_ENV === 'production');

/**
 * Include hash to filenames for cache busting - only at production
 */
const fileNamePrefix = isProduction ? '[chunkhash].' : '';

/**
 * An instance of ExtractTextPlugin
 */
const extractLess = new ExtractTextPlugin({
  filename: fileNamePrefix + "[name].css"
});

/**
 * Options to clean dist folder
 */
const pathsToClean = [
  'dist'
];
const cleanOptions = {
  root: __dirname,
  verbose: true,
  dry: false,
  exclude: []
};

module.exports = {
  context: __dirname,
  entry: {
    home: './src/js/home.js',
    status: './src/js/status.js',
    about: './src/js/about.js',
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: fileNamePrefix + '[name].js',
    publicPath: "/dist/",
    library: "bundle"
  },
  devServer: { // Configuration for webpack-dev-server
    compress: true,
    port: 8080,
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['env', 'es2015']
            //plugins: ['transform-custom-element-classes']
          }
        }
      },
      {
        test: /\.(less|css)$/,
        use: extractLess.extract({ // Use the instance of ExtractTextPlugin for CSS files
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'less-loader',
              options: {
                sourceMap: true
              }
            }
          ],
          fallback: {
            loader: 'style-loader',
            options: {
              sourceMap: true
            }
          }
        })
      },
      {
        test: /\.(svg|eot|ttf|woff|woff2)$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: 'fonts/[name].[ext]'
        }
      },
      {
        test: /\.(png|jpg|gif)$/,
        loaders: [
          {
            loader: "url-loader",
            options: {
              limit: 10000,
              name: 'images/[name].[text]'
            }
          },
          'img-loader' // optional image compression remove this if img-loader binary build fails in your OS
        ]
      }
    ]
  },
  devtool: "source-map",
  plugins: [
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      jquery: 'jquery'
    }),
    extractLess, // Make sure ExtractTextPlugin instance is included in array before the PurifyCSSPlugin
    new PurifyCSSPlugin({
      paths: glob.sync([
        path.join(__dirname, '/*.html'),
        path.join(__dirname, '/node_modules/jquery/dist/*.js'),
        path.join(__dirname, '/node_modules/bootstrap/dist/js/*.js'),
        path.join(__dirname, '/node_modules/toastr/toastr.js')
      ]),
      minimize: true
    }),
    new BrowserSyncPlugin(
      {
      host: 'localhost',
      port: 3000,
      proxy: 'http://localhost:8080/'
      },
      {
        files: 'EventRegistration/*.html'
      },
    ),
    new webpack.DefinePlugin({ // Remove this plugin if you don't plan to define any global constants
      ENVIRONMENT: JSON.stringify(process.env.NODE_ENV),
      SERVER_URL: JSON.stringify(process.env.SERVER_URL),
      GMAP_KEY: JSON.stringify(process.env.GMAP_KEY),
      API: JSON.stringify(process.env.API),
    })
  ]
};

/**
 * Non-Production plugins
 */
if(!isProduction) {
  module.exports.plugins.push(
    new webpack.HotModuleReplacementPlugin() // HMR plugin will cause problems with [chunkhash]
  );
}

/**
 * Production only plugins
 */
if(isProduction) {
  module.exports.plugins.push(
    //new webpack.optimize.UglifyJsPlugin({
      //sourceMap: true // use false if you want to disable source maps in production
    //}),
    function() { // Create a manifest.json file that contain the hashed file names of generated static resources
      this.plugin("done", function(status) {
        fs.writeFileSync(
          path.join(__dirname, "/dist/manifest.json"),
          JSON.stringify(status.toJson().assetsByChunkName)
        );
      });
    },
    new CleanWebpackPlugin(pathsToClean, cleanOptions)
  );
}
