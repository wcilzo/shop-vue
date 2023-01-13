<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoleVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <!-- 添加row-key="id" 让删除后依旧显示权限列表 -->
      <el-table :data="roleList" row-key="id" border stripe>
        <el-table-column type="expand">
          <template v-slot:default="scope">
            <el-row :class="['bdbottom', i1 === 0 ? 'bdtop':'', 'vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag size="large" closable @close="removeRightById(scope.row, item1.id)">{{ item1.authName }}</el-tag>
                <el-icon>
                  <CaretRight />
                </el-icon>
              </el-col>
              <!-- 渲染二级和三级 -->
              <el-col :span="19">
                <el-row :class="[i2 === 0 ? '':'bdtop', 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" size="large" closable @close="removeRightById(scope.row, item2.id)">{{ item2.authName }}</el-tag>
                    <el-icon>
                      <CaretRight />
                    </el-icon>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id" size="large" closable @close="removeRightById(scope.row, item3.id)">{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="角色操作" width="320px">
          <template v-slot:default="scope">
            <el-button v-model="scope.row" type="primary" :icon="Edit" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
            <el-button type="danger" :icon="Delete" size="mini" @click="removeRoleById(scope.row.id)">删除</el-button>
            <el-button type="warning" :icon="Setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog v-model="addRoleVisible" title="添加角色" width="50%" @close="addDialogClosed">
      <el-form ref="addRoleRef" :model="addRoleForm" :rules="addRoleRules" label-width="80px" status-icon>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"/>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addRoleVisible = false">取消</el-button>
          <el-button type="primary" @click="addRole">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
      <el-dialog v-model="editRoleDialogVisible" title="编辑角色" width="50%" @close="editDialogClosed">
        <el-form ref="editRoleFormRef" :model="editRoleForm" :rules="editRoleFormRules" label-width="80px" status-icon>
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editRoleForm.roleName"/>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editRoleForm.roleDesc" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="editRoleDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="editRoleInfo">确认</el-button>
          </span>
        </template>
    </el-dialog>
    <el-dialog v-model="setRightDialogVisible" title="分配权限" width="50%" @close="setRightDialogClosed">
      <el-tree :data="rightsList" ref="treeRef" :props="treeProps" node-key="id" :default-checked-keys="defKeys" default-expand-all show-checkbox />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="allotRights">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ArrowRight, Edit, Delete, Setting, CaretRight } from '@element-plus/icons-vue'
export default {
  data () {
    return {
      roleList: [],
      addRoleVisible: false,
      setRightDialogVisible: false,
      editRoleDialogVisible: false,
      rightsList: [],
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      defKeys: [],
      roleId: '',
      addRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 10, message: '角色名称的长度在3~10个字符之间', trigger: 'blur' }
        ],
        roleDesc: [
          { required: false, message: '请输入角色描述', trigger: 'blur' },
          { min: 0, max: 256, message: '角色描述的长度在1~256个字符之间', trigger: 'blur' }
        ]
      },
      editRoleForm: {},
      editRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 10, message: '角色名称的长度在3~10个字符之间', trigger: 'blur' }
        ],
        roleDesc: [
          { required: false, message: '请输入角色描述', trigger: 'blur' },
          { min: 0, max: 256, message: '角色描述的长度在1~256个字符之间', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败 ')
      }
      this.roleList = res.data
    },
    async removeRightById (role, rightId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该权限, 是否继续',
        '提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除! ')
      }
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败! ')
      }
      role.children = res.data
      this.$message.success('删除成功! ')
    },
    async showSetRightDialog (role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败! ')
      }
      this.rightsList = res.data
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 递归获取三级权限id，保存到defKeys
    getLeafKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    setRightDialogClosed () {
      this.defKeys = []
    },
    async allotRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败! ')
      }
      this.$message.success('分配权限成功! ')
      this.getRolesList()
      this.setRightDialogVisible = false
    },
    addDialogClosed () {
      this.$refs.addRoleRef.resetFields()
    },
    async addRole () {
      const { data: res } = await this.$http.post('roles', this.addRoleForm)
      if (res.meta.status !== 201) {
        return this.$message.error('添加失败! ')
      }
      this.$message.success('添加成功!')
      this.addRoleVisible = false
      this.getRolesList()
    },
    editDialogClosed () {
      this.$refs.editRoleFormRef.resetFields()
    },
    async showEditDialog (id) {
      // console.log(id)
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询角色信息失败! ')
      }
      this.editRoleForm = res.data
      this.editRoleDialogVisible = true
    },
    // 这里有一个坑,传id的时候传的是roleId,因为在上面赋值的时候从后台传进的是roleId不是id
    async editRoleInfo () {
      const { data: res } = await this.$http.put('roles/' + this.editRoleForm.roleId, { roleName: this.editRoleForm.roleName, roleDesc: this.editRoleForm.roleDesc })
      if (res.meta.status !== 200) {
        this.$message.error('提交失败! ')
      }
      this.editRoleDialogVisible = false
      this.getRolesList()
      this.$message.success('提交成功! ')
    },
    async removeRoleById (id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续',
        '提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除! ')
      }
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除角色失败! ')
      }
      this.$message.success('删除成功! ')
      this.getRolesList()
    }
  },
  setup () {
    return {
      ArrowRight,
      Edit,
      Delete,
      Setting
    }
  },
  components: {
    CaretRight
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
