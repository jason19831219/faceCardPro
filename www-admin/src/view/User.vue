<template>
  <div>
    <div>
      <el-button size="small" type="primary" @click="handleAdd('itemForm')">添加</el-button>
    </div>
    <div style="margin-top: 20px">
      <span size="small" type="disable">筛选:</span>
      <el-select v-model="genderSelectionResult" placeholder="请选择性别" v-on:change="getAllWithFilter()">
        <el-option
                v-for="item in genderSelectionList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="faceShapeSelectionResult" placeholder="请选择脸型" v-on:change="getAllWithFilter()">
        <el-option
                v-for="item in faceShapeSelectionList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
        </el-option>
      </el-select>
    </div>
    <el-table
      :data="list"
      style="width: 100%"
      ref="table">
      <el-table-column
        prop="_id"
        label="_id"
        width="100">
      </el-table-column>
      <el-table-column
        prop="userName"
        label="userName"
        width="400">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="mobile"
        width="400">
      </el-table-column>
      <el-table-column
        prop="openId"
        label="openId"
        width="400">
      </el-table-column>
      <el-table-column
        prop="unionId"
        label="unionId"
        width="400">
      </el-table-column>
      <el-table-column
        prop="wxUserInfo"
        label="wxUserInfo"
        show-overflow-tooltip
        width="400">

        <template slot-scope="scope">
          <p v-for="(item,index) in scope.row.wxUserInfo" :key="index">
            <span>{{index}}</span><span>:</span><span>{{item}}</span></p>
        </template>
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
        <el-form-item label="id" prop="_id">
          <el-input placeholder="请输入userName" v-model="itemForm._id"></el-input>
        </el-form-item>
        <el-form-item v-if="itemDialog.title !== '删除'" label="password" prop="password">
          <el-input placeholder="请输入password" v-model="itemForm.password"></el-input>
        </el-form-item>
        <el-form-item v-if="itemDialog.title !== '删除'" label="passwordConfirmed" prop="passwordConfirmed">
          <el-input placeholder="请输入passwordConfirmed" v-model="itemForm.passwordConfirmed"></el-input>
        </el-form-item>
        <!--<el-form-item label="mobile" prop="mobile">-->
          <!--<el-input placeholder="请输入mobile" v-model="itemForm.mobile"></el-input>-->
        <!--</el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="itemDialog.visable = false">取 消</el-button>
        <el-button v-if="itemDialog.title == '添加'" type="primary" @click="addOne('itemForm')">{{itemDialog.title}}
        </el-button>
        <!--<el-button v-if="itemDialog.title == '修改'" type="primary" @click="updateOne('itemForm')">{{itemDialog.title}}-->
        <!--</el-button>-->
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
import { mapGetters } from 'vuex'
import validatorUtil from '@/utils/validation'

export default {
  methods: {
    handleAdd () {
      this.itemDialog.visable = true
      this.itemDialog.title = '添加'
      this.$store.dispatch('user/setForm', -1)
    },
    handleUpdate (index) {
      this.itemDialog.visable = true
      this.itemDialog.title = '修改'
      this.$store.dispatch('user/setForm', index)
    },
    handleDelete (index) {
      this.itemDialog.visable = true
      this.itemDialog.title = '删除'
      this.$store.dispatch('user/setForm', index)
    },
    addOne (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store.dispatch('user/addOne', formName)
        } else {
          this.$message.error('error submit!!')
          return false
        }
      })
    },
    updateOne (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store.dispatch('user/updateOne')
        } else {
          this.$message.error('error submit!!')
          return false
        }
      })
    },
    deleteOne (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store.dispatch('user/deleteOne')
        } else {
          this.$message.error('error submit!!')
          return false
        }
      })
    },
    getAllWithFilter () {
      this.$store.dispatch('user/getAll', {
        gender: ((this.genderSelectionResult === '') || (this.genderSelectionResult === 'all')) ? '' : this.genderSelectionResult,
        faceShape: this.faceShapeSelectionResult === '' || this.faceShapeSelectionResult === 'all' ? '' : this.faceShapeSelectionResult
      })
    },
    handleSizeChange (val) {
      this.$store.dispatch('user/setPageSize', val)
    },
    handleCurrentChange (val) {
      this.$store.dispatch('user/setPageNumber', val)
    }
  },
  components: {},
  computed: {
    ...mapGetters({
      list: 'user/list',
      listInfo: 'user/listPageInfo',
      itemForm: 'user/itemForm',
      itemDialog: 'user/itemDialog'
    })
  },
  data () {
    return {
      genderSelectionList: [
        {
          value: 'all',
          label: '全部'
        }, {
          value: 'male',
          label: '男'
        }, {
          value: 'female',
          label: '女'
        }
      ],
      genderSelectionResult: '',
      faceShapeSelectionList: [
        {
          value: 'all',
          label: '全部'
        }, {
          value: 'square',
          label: '正方形'
        }, {
          value: 'heart',
          label: '心型'
        }, {
          value: 'oval',
          label: '椭圆形'
        }, {
          value: 'round',
          label: '圆形'
        }, {
          value: 'triangle',
          label: '三角形'
        }
      ],
      faceShapeSelectionResult: '',
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
    this.$store.dispatch('user/getAll')
  }
}
</script>
<style scoped="scoped">

</style>
