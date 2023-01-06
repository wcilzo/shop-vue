import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import initElement from './plugins/element.js'
import 'element-plus/dist/index.css'
import axios from 'axios'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

const app = createApp(App)
// 配置请求根路径
// 关于axios https://blog.csdn.net/block_xu/article/details/111150883
app.config.globalProperties.$http = axios
initElement(app)
app.use(router)
app.mount('#app')
