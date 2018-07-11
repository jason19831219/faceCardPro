<template>
  <div>
    <div>
      <el-button size="small" type="primary" @click="handleAdd('itemForm')">添加</el-button>
    </div>
    <el-table
      :data="list"
      style="width: 100%"
      ref="table">
      <el-table-column
        prop="userName"
        label="userName">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="mobile"
        width="400">
      </el-table-column>
      <el-table-column
        prop="createDate"
        label="createDate"
        width="400">
      </el-table-column>
      <el-table-column
        prop="updateDate"
        sortable
        label="updateDate"
        width="400">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="400">
        <template slot-scope="scope">
          <el-button
            type="primary"
            @click="handleUpdate(scope.$index)"
            size="small">
            修改
          </el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.$index)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page=listInfo.pageNumber
      :page-sizes="[10,20,50,100]"
      :page-size=listInfo.pageSize
      layout="total, sizes, prev, pager, next, jumper"
      :total=listInfo.totalItems>
    </el-pagination>
    <el-dialog :title="itemDialog.title" :visible.sync="itemDialog.visable">
      <el-form :model="itemForm" :rules="itemRule" ref="itemForm">
        <el-form-item label="userName" prop="userName">
          <el-input placeholder="请输入userName" v-model="itemForm.userName"></el-input>
        </el-form-item>
        <el-form-item v-if="itemDialog.title !== '删除'" label="password" prop="password">
          <el-input placeholder="请输入password" v-model="itemForm.password"></el-input>
        </el-form-item>
        <el-form-item v-if="itemDialog.title !== '删除'" label="passwordConfirmed" prop="passwordConfirmed">
          <el-input placeholder="请输入passwordConfirmed" v-model="itemForm.passwordConfirmed"></el-input>
        </el-form-item>
        <el-form-item label="mobile" prop="mobile">
          <el-input placeholder="请输入mobile" v-model="itemForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="itemDialog.visable = false">取 消</el-button>
        <el-button v-if="itemDialog.title == '添加'" type="primary" @click="addOne('itemForm')">{{itemDialog.title}}
        </el-button>
        <el-button v-if="itemDialog.title == '修改'" type="primary" @click="updateOne('itemForm')">{{itemDialog.title}}
        </el-button>
        <el-button v-if="itemDialog.title == '删除'" type="primary" @click="deleteOne('itemForm')">{{itemDialog.title}}
        </el-button>
      </div>
    </el-dialog>

    <!--<el-dialog title="提示" :visible.sync="NoticeVisable" width="30%" center>-->
    <!--<span>确定执行删除？</span>-->
    <!--<span slot="footer" class="dialog-footer">-->
    <!--<el-button @click="NoticeVisable = false">取 消</el-button>-->
    <!--<el-button type="primary" @click="deleteOne()">确 定</el-button>-->
    <!--</span>-->
    <!--</el-dialog>-->
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import validatorUtil from '@/utils/validation'

export default {
  methods: {
    handleAdd () {
      this.itemDialog.visable = true
      this.itemDialog.title = '添加'
      this.$store.dispatch('admin/setForm', -1)
    },
    handleUpdate (index) {
      this.itemDialog.visable = true
      this.itemDialog.title = '修改'
      this.$store.dispatch('admin/setForm', index)
    },
    handleDelete (index) {
      this.itemDialog.visable = true
      this.itemDialog.title = '删除'
      this.$store.dispatch('admin/setForm', index)
    },
    addOne (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store.dispatch('admin/addOne', formName)
        } else {
          this.$message.error('error submit!!')
          return false
        }
      })
    },
    updateOne (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store.dispatch('admin/updateOne')
        } else {
          this.$message.error('error submit!!')
          return false
        }
      })
    },
    deleteOne (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store.dispatch('admin/deleteOne')
        } else {
          this.$message.error('error submit!!')
          return false
        }
      })
    },
    handleSizeChange (val) {
      this.$store.dispatch('admin/setPageSize', val)
    },
    handleCurrentChange (val) {
      this.$store.dispatch('admin/setPageNumber', val)
    }
  },
  components: {},
  computed: {
    ...mapGetters({
      list: 'admin/list',
      listInfo: 'admin/listPageInfo',
      itemForm: 'admin/itemForm',
      itemDialog: 'admin/itemDialog'
    })
  },
  data () {
    return {
      itemRule: {
        userName: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入用户名'))
              } else {
                if (!validatorUtil.checkUserName(value)) {
                  callback(new Error('5-12个英文字符!'))
                }
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入密码'))
              } else {
                if (!validatorUtil.checkPwd(value)) {
                  callback(new Error('6-12位，只能包含字母、数字和下划线!'))
                }
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        passwordConfirmed: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入确认密码'))
              } else {
                if (value !== this.itemForm.password) {
                  callback(new Error('两次输入密码不一致!'))
                }
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入手机号'))
              } else {
                if (typeof value !== 'string') {
                  value = value.toString()
                }
                if (!validatorUtil.checkMobilePhone(value)) {
                  callback(new Error('请输入正确的手机号'))
                }
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted () {
    this.$store.dispatch('admin/getAll')
  }
}
</script>
<style scoped="scoped">

</style>
