<template>
  <!-- 顶部 -->
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px':'200px'">
        <div class="toggle-button" @click="this.isCollapse = !this.isCollapse">
          <el-icon><Switch /></el-icon>
        </div>
        <!-- 侧边栏菜单区 -->
        <el-menu
          active-text-color="#409eff"
          background-color="#333744"
          text-color="#fff" unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="this.$router.currentRoute.path"
          >
          <!-- 一级菜单 -->
        <el-sub-menu :index="item.id + ''" v-for="item in menulist" :key="item.id">
          <!-- 一级菜单的模板区 -->
          <template #title>
            <!-- 图标 -->
            <i :class="iconsObj[item.id]"></i>
            <!-- 文本 -->
            <span>{{item.authName}}</span>
          </template>
          <!-- 二级菜单 -->
          <el-menu-item
            :index="'/Home/' + subItem.path"
            v-for="subItem in item.children"
            :key="subItem.id"
            >
            <template #title>
            <!-- 图标 -->
            <el-icon><Menu /></el-icon>
            <!-- 文本 -->
            <span>{{subItem.authName}}</span>
          </template>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
      </el-aside>
      <!-- 右侧内容 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { Menu, Switch } from '@element-plus/icons-vue'

export default {
  data () {
    return {
      menulist: [],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false
    }
  },
  created () {
    this.getMenuList()
  },
  components: {
    Menu,
    Switch
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.home-container{
  height: 100%;
}
.el-header{
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div{
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside{
  background-color: #333744;
  transition: 0.5s;
  .el-menu{
    border-right: none;
  }
}
.el-main{
  background-color: #eaedf1;
}
.iconfont{
  margin-right: 10px
}
.toggle-button{
  background-color: #4a5064;
  height: 30px;
  color: #fff;
  text-align: center;
  cursor: pointer;
  .el-icon{
    transform: translate(-20%, 40%);
  }
}
</style>
