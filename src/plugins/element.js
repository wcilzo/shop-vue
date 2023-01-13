import {
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElMessage,
  ElContainer,
  ElHeader,
  ElAside,
  ElMain,
  ElMenu,
  ElSubMenu,
  ElMenuItemGroup,
  ElMenuItem,
  ElIcon,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElCard,
  ElRow,
  ElCol,
  ElTable,
  ElTableColumn,
  ElSwitch,
  ElTooltip,
  ElPagination,
  ElDialog,
  ElMessageBox,
  ElTag,
  ElTree,
  ElSelect,
  ElOption
} from 'element-plus'

const components = [
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElContainer,
  ElHeader,
  ElAside,
  ElMain,
  ElMenu,
  ElSubMenu,
  ElMenuItemGroup,
  ElMenuItem,
  ElIcon,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElCard,
  ElRow,
  ElCol,
  ElTable,
  ElTableColumn,
  ElSwitch,
  ElTooltip,
  ElPagination,
  ElDialog,
  ElTag,
  ElTree,
  ElSelect,
  ElOption
]
export default (Vue) => {
  components.forEach(item => {
    Vue.use(item)
  })
  Vue.config.globalProperties.$message = ElMessage
  Vue.config.globalProperties.$confirm = ElMessageBox.confirm
}
