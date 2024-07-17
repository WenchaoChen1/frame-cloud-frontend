// TODO
// https://umijs.org/config/
// import { join } from 'path';
import { defineConfig } from '@umijs/max';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';

const { REACT_APP_ENV = 'dev' } = process.env;

export default defineConfig({
  // TODO
  // targets: { ie: 11, },  // 兼容性设置
  // model: {}, // 数据流插件

  hash: true, // 开启 hash 模式
  routes, // 路由的配置，不在路由中引入的文件不会编译
  theme: { // 主题的配置
    // 如果不想要 configProvide 动态设置主题需要把这个设置为 default
    // 只有设置为 variable， 才能使用 configProvide 动态设置主色调
    'root-entry-name': 'variable',
  },
  ignoreMomentLocale: true, // moment 的国际化配置
  proxy: proxy[REACT_APP_ENV as keyof typeof proxy], // 代理配置
  fastRefresh: true, // 快速热更新配置

  //============== 以下都是max的插件配置 ===============
  model: {}, // 数据流插件
  initialState: {}, // 一个全局的初始数据流，可以用它在插件之间共享数据
  title: 'Ant Design Pro', // layout 插件
  layout: {
    locale: true,
    ...defaultSettings,
  },
  moment2dayjs: { // moment2dayjs 插件
    preset: 'antd',
    plugins: ['duration'],
  },
  locale: { // 国际化插件
    default: 'zh-CN',
    antd: true,
    baseNavigator: true, // default true, when it is true, will use `navigator.language` overwrite default
  },
  antd: {}, // antd 插件
  request: {}, // 网络请求配置
  access: {}, // 权限插件
  headScripts: [ // <head> 中额外的 script
    // 解决首次加载时白屏的问题
    { src: '/scripts/loading.js', async: true },
  ],

  //================ pro 插件配置 =================
  presets: ['umi-presets-pro'],
  mock: {
    include: ['mock/**/*', 'src/pages/**/_mock.ts'],
  },
  define: {  // 定义一些全局变量
    'process.env': {
      FRAME_IDENTITY_SERVICE: process.env.FRAME_IDENTITY_SERVICE,
      FRAME_SYSTEM_SERVICE: process.env.FRAME_SYSTEM_SERVICE,
      FRAME_API_URL:  process.env.FRAME_API_URL,
      UMI_APP_TARGET:  process.env.UMI_APP_TARGET,
      UMI_APP_TARGETa:  process.env.UMI_APP_TARGETa,
      TARGET:  process.env.TARGET,
      FRAME_SERVICE_API:  process.env.FRAME_SERVICE_API,
    },
  },
  mfsu: {
    strategy: 'normal',
  },
  esbuildMinifyIIFE: true,
  requestRecord: {},
  openAPI: [ // openAPI 插件的配置
    // TODO
    // {
    //   requestLibPath: "import { request } from '@umijs/max'",
    //   // 或者使用在线的版本
    //   // schemaPath: "https://gw.alipayobjects.com/os/antfincdn/M%24jrzTTYJN/oneapi.json"
    //   schemaPath: join(__dirname, 'oneapi.json'),
    //   mock: false,
    // },
    // {
    //   requestLibPath: "import { request } from '@umijs/max'",
    //   schemaPath: 'http://localhost:8201/gstdev-identity/v3/api-docs/openapi.json',
    //   projectName: 'swagger',
    // },
    // {
    //   requestLibPath: "import { request } from '@umijs/max'", // 要使用的请求库
    //   schemaPath: 'http://localhost:8201/gstdev-identity/v3/api-docs',
    //   projectName: '/swagger/identity', // 生成的api目录名（一般按模块划分）
    //   apiPrefix: 'process.env.FRAME_IDENTITY_SERVICE', // 接口声明文档中请求的前缀名
    // },
    // {
    //   requestLibPath: "import { request } from '@umijs/max'",
    //   schemaPath: 'http://localhost:8201/gstdev-system/v3/api-docs',
    //   projectName: '/swagger/system',
    //   apiPrefix: 'process.env.SYSTREM_SERVICE',
    // },
  ],
});
