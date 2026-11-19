import { IConfig } from 'umi-types'

export default {
  hash: true,
  theme: './src/themes/index.js',
  treeShaking: true,
  disableCSSModules: true,
  define: {
    'process.env.UMI_ENV': process.env.UMI_ENV
  },
  targets: {
    chrome: 49,
    firefox: 45,
    safari: 10,
    ie: 10,
    ios: 10
  },
  plugins: [
    [
      'umi-plugin-react',
      {
        dva: {
          immer: false
        },
        antd: true,
        routes: {
          exclude: [
            /model\.(j|t)sx?$/,
            /service\.(j|t)sx?$/,
            /models\//,
            /components\//,
            /services\//,
            /helpers\//
          ]
        },
        locale: {
          default: 'zh-CN',
          baseNavigator: true,
          antd: true
        },
        library: 'react',
        dynamicImport: {
          webpackChunkName: true,
          level: 2
        },
        title: {
          defaultTitle: '博客后台管理系统',
          useLocale: true
        },
        pwa: false,
        hd: false,
        fastClick: false
      }
    ]
  ]
} as IConfig
