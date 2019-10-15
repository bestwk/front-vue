// 以当前时间定义版本号，防止打包项目浏览器中出现缓存
const version = new Date().getTime()
// 导入compression-webpack-plugin
const CompressionWebpackPlugin = require('compression-webpack-plugin')
// 定义压缩文件类型
const productionGzipExtensions = ['js', 'css']

const path = require('path')

const resolve = dir => {
  return path.join(__dirname, dir)
}

// 项目部署基础
// 默认情况下，我们假设你的应用将被部署在域的根目录下,
// 例如：https://www.my-app.com/
// 默认：'/'
// 如果您的应用程序部署在子路径中，则需要在这指定子路径
// 例如：https://www.foobar.com/my-app/
// 需要将它改为'/my-app/'
console.log('---------------------------------------------------------', process.env.NODE_ENV)
const BASE_URL = process.env.NODE_ENV === 'production'
  ? '/electronic-pos-web/'
  : ''

module.exports = {
  // Project deployment base
  // By default we assume your app will be deployed at the root of a domain,
  // e.g. https://www.my-app.com/
  // If your app is deployed at a sub-path, you will need to specify that
  // sub-path here. For example, if your app is deployed at
  // https://www.foobar.com/my-app/
  // then change this to '/my-app/'
  baseUrl: '/',
  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))
      .set('_conf', resolve('config'))

    if (process.env.NODE_ENV === 'production') {
      // 打包文件加入时间防止浏览器缓存导致无法更新代码
      config.output
        .filename('js/[name].[chunkhash].' + version + '.js')
        .chunkFilename('js/[id].[chunkhash].' + version + '.js')
    }
  },
  // 打包时不生成.map文件
  productionSourceMap: false,
  // devServer: {
  //   proxy: 'http://localhost:10009'
  // },
  configureWebpack: {
    plugins: [
      new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      })
    ]
  },
  // 在多核机器下会默认开启。
  parallel: require('os').cpus().length > 1
}
