<template>
  <div class="container">
    <header class="search-wrap">
      <el-form class="form" :inline="true">
        <el-form-item>
          <el-input clearable size="small" @change="handleNameChange" v-model="form.name" placeholder="输入用户名"></el-input>
        </el-form-item>
        <el-button size="small" type="primary" @click="handleNameChange">搜索</el-button>
      </el-form>

    </header>

    <el-table border stripe :data="users" v-loading="options.loading">
      <!-- ID -->
      <el-table-column height="100px" align="center" prop="id" label="用户id"></el-table-column>

      <!-- 头像 -->
      <el-table-column align="center" prop="avatar" label="头像" width="80px">
        <template slot-scope="{row}">
          <img class="avatar" :src="row.avatar" alt="">
        </template>
      </el-table-column>

      <el-table-column align="center" prop="username" label="用户名"></el-table-column>

      <!-- 昵称 -->
      <el-table-column align="center" prop="nickname" label="昵称"></el-table-column>

      <!-- 注册时间 -->
      <el-table-column align="center" prop="register_time" label="注册时间"></el-table-column>

      <!-- 登录时间 -->
      <el-table-column align="center" prop="last_login_time" label="最近登录时间"></el-table-column>

      <!-- 注册IP -->
      <el-table-column align="center" prop="register_ip" label="注册IP"></el-table-column>

      <!-- 登录IP -->
      <el-table-column align="center" prop="last_login_ip" label="登录IP"></el-table-column>
    </el-table>

    <el-pagination
      class="pagination"
      layout="prev, pager, next"
      @current-change="handlePageChange"
      :page-size="options.size"
      :total="options.totalCount">
    </el-pagination>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex';
  import SearchBar from "../../components/SearchBar/index";

  export default {
    components: {SearchBar},
    data() {
      return {
        form: {
          name: '',
        }
      }
    },
    computed: {
      ...mapState('user', {
        users: state => state.users,
        options: state => state.usersOptions
      })
    },
    methods: {
      ...mapActions('user', [
        'getUsers',
        'handleApiMethods',
        'setUsersOptions'
      ]),
      handleNameChange (name) {
        this.setUsersOptions({name, page: 1});
        this.getUsers();
      },
      handlePageChange (page) {
        this.setUsersOptions({page});
        this.getUsers();
      }
    },
    mounted() {
      this.getUsers();
    }
  }
</script>

<style scoped>
  >>> .el-input__inner{
    height: 34px;
    line-height: 34px;
  }
  >>> .el-form-item{
    margin-bottom: 0;
  }
</style>
<style scoped>
  .container {
    padding: 20px;
    position: relative;
    min-height: 100%;
    padding-bottom: 60px;
  }
  .container > .search-wrap{
    width: 100%;
    height: 50px;
    display: flex;
    margin-bottom: 10px;
    justify-content: flex-end;
  }
  .container > .pagination{
    left: 20px;
    width: calc(100% - 40px);
    bottom: 10px;
    position: absolute;
    text-align: right;
  }
  .avatar{
    width: 40px;
    height: 40px;
    margin: 0 auto;
    display: flex;
  }

  .form{
    display: flex;
    align-items: center;
  }
</style>

