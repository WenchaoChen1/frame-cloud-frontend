// 代理的配置文件
// TODO
// const target = 'http://192.168.1.2:8201';
const target = 'http://192.168.0.229:8201';

export default {
  dev: {
    '/api': {
      target,
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
    '/mock': {
      target: 'https://proapi.azurewebsites.net',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },

  // TODO
  // 如果需要自定义本地开发服务器  请取消注释按需调整
  // dev: {
  //   // localhost:8000/api/** -> https://preview.pro.ant.design/api/**
  //   '/api/': {
  //     // 要代理的地址
  //     target: 'https://preview.pro.ant.design',
  //     // 配置了这个可以从 http 代理到 https
  //     // 依赖 origin 的功能可能需要这个，比如 cookie
  //     changeOrigin: true,
  //   },
  // },
  // test: { // 详细的代理配置
  //   // localhost:8000/api/** -> https://preview.pro.ant.design/api/**
  //   '/api/': {
  //     target: 'https://proapi.azurewebsites.net',
  //     changeOrigin: true,
  //     pathRewrite: { '^': '' },
  //   },
  // },
  // pre: {
  //   '/api/': {
  //     target: 'your pre url',
  //     changeOrigin: true,
  //     pathRewrite: { '^': '' },
  //   },
  // },
};
