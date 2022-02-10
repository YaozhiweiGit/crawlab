const path = require("path")
const CopyWebpackPlugin = require('copy-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const alias = {
  'element-plus$': 'element-plus/dist/index.full.min.js',
  'echarts$': 'echarts/dist/echarts.min.js',
  'codemirror$': 'codemirror/lib/codemirror.js',
}

const optimization = {
  splitChunks: {
    chunks: 'initial',
    minSize: 20000,
    minChunks: 1,
    maxAsyncRequests: 3,
    cacheGroups: {
      vendors: {
        test: /[\\/]node_modules[\\/]/,
        priority: -10,
        reuseExistingChunk: true,
      },
    },
  },
}

const config = {
  pages: {
    index: {
      entry: 'src/main.ts',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'Crawlab | Distributed Web Crawler Platform'
    }
  },
  outputDir: './dist',
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.js$/,
          include: /node_modules\/crawlab-ui/,
          loader: 'raw-loader',
        }
      ]
    },
    optimization,
    resolve: {
      alias,
    },
    plugins: []
  }
}

if (['development', 'local'].includes(process.env.NODE_ENV)) {
  // do nothing
} else if (['production', 'docker'].includes(process.env.NODE_ENV)) {
  config.configureWebpack.plugins.push(new CopyWebpackPlugin({
    patterns: [
      {
        from: path.resolve(__dirname, 'public/js'),
      }
    ]
  }))
} else if (['analyze'].includes(process.env.NODE_ENV)) {
  config.configureWebpack.plugins.push(new BundleAnalyzerPlugin({
    analyzePort: 8890,
  }))
}

module.exports = config
