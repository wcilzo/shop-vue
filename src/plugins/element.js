import { ElForm, ElFormItem, ElInput, ElButton, ElMessage } from 'element-plus'

const components = [
  ElForm,
  ElFormItem,
  ElInput,
  ElButton
]
export default (Vue) => {
  components.forEach(item => {
    Vue.use(item)
  })
  Vue.config.globalProperties.$message = ElMessage
}
