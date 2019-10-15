const path = require('path')

/* const resolve = dir => {
  return path.join(__dirname, dir)
} */

export default {
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 1,
  /**
   * @description 是否使用国际化，默认为false
   *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
   *              用来在菜单中显示文字
   */
  useI18n: false,
  /**
   * @description api请求基础路径
   */

  baseUrl: {
    dev: 'http://192.168.0.103:60808',
    // dev: 'https://enterprise.michain.tech/',
    pro: 'https://enterprise.michain.tech/',
    // dev: 'https://apijqc.fengmeitianxia.com',
    upload: 'http://192.168.0.68:60808',
    display: 'http://192.168.0.68:8090/'
    // upload: 'https://enterprise.michain.tech/',
    // display: 'http://imgjysl2cs.fengmeitianxia.com/'
    // pro: 'https://apijqc.fengmeitianxia.com',
  },
  build: {
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: '/',
    assetsPublicPath: '',
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: true,
    productionGzipExtensions: ['js', 'css']
  }
}
