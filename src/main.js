import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import initElement from './plugins/element.js'
import 'element-plus/dist/index.css'
import axios from 'axios'
import './assets/fonts/iconfont.css'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  // 这里很奇怪，标头找不到， 用谷歌浏览器跨域也找不到，但是可以输出出值为null，在config中也能找到
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
const app = createApp(App)
// 配置请求根路径
// 关于axios https://blog.csdn.net/block_xu/article/details/111150883
app.config.globalProperties.$http = axios
initElement(app)
app.use(router)
app.mount('#app')
