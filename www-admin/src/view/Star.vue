<template xmlns:div="http://www.w3.org/1999/html">
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
                    fixed="left"
                    prop="name"
                    label="name"
                    width="200"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop="src"
                    label="src"
                    width="100"
                    show-overflow-tooltip>
                <template slot-scope="scope">
                    <img :src="scope.row.src" min-width="70" height="70"/>
                </template>
            </el-table-column>
            <el-table-column
                    prop="age"
                    label="age"
                    width="200"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop="yaw"
                    label="yaw"
                    width="200"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop="pitch"
                    label="pitch"
                    width="200"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop="roll"
                    label="roll"
                    width="200"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop="beauty"
                    label="beauty"
                    width="200"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop="expression"
                    label="expression"
                    width="200"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop="face_probability"
                    label="face_probability"
                    width="200"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop="face_shape"
                    label="face_shape"
                    sortable
                    width="200"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop="face_token"
                    label="face_token"
                    width="200"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop="gender"
                    label="gender"
                    sortable
                    width="200"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop="glasses"
                    label="glasses"
                    width="200"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop="landmark"
                    label="landmark"
                    width="200"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop="landmark72"
                    label="landmark72"
                    width="200"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop="location"
                    label="location"
                    width="200"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop="race"
                    label="race"
                    width="200"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop="createDate"
                    label="createDate"
                    width="200">
            </el-table-column>
            <el-table-column
                    prop="updateDate"
                    sortable
                    label="updateDate"
                    width="200">
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作"
                    width="200">
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
                :page-sizes="[10,20,50,100,500]"
                :page-size=listInfo.pageSize
                layout="total, sizes, prev, pager, next, jumper"
                :total=listInfo.totalItems>
        </el-pagination>
        <el-dialog :title="itemDialog.title" :visible.sync="itemDialog.visable">
            <el-form :model="itemForm" :rules="itemRule" ref="itemForm">
                <el-form-item label="明星图片">
          <span class="img-upload-btn">
            <i v-if="!itemForm.src" id="avatar-uploader-icon" class="el-icon-plus"></i>
            <img v-if="itemForm.src" :src="itemForm.src"/>
            <input @change="uploadImage" type="file" accept="image/*" name="image"/>
          </span>
                </el-form-item>
                <el-form-item label="src" prop="src">
                    <el-input placeholder="src" v-model="itemForm.src"></el-input>
                </el-form-item>
                <el-form-item label="name" prop="name">
                    <el-input placeholder="name" v-model="itemForm.name"></el-input>
                </el-form-item>
                <el-form-item label="age" prop="age">
                    <el-input placeholder="age" v-model="itemForm.age"></el-input>
                </el-form-item>
                <el-form-item label="yaw" prop="yaw">
                    <el-input placeholder="yaw" v-model="itemForm.yaw"></el-input>
                </el-form-item>
                <el-form-item label="pitch" prop="pitch">
                    <el-input placeholder="pitch" v-model="itemForm.pitch"></el-input>
                </el-form-item>
                <el-form-item label="roll" prop="roll">
                    <el-input placeholder="roll" v-model="itemForm.roll"></el-input>
                </el-form-item>
                <el-form-item label="beauty" prop="beauty">
                    <el-input placeholder="beauty" v-model="itemForm.beauty"></el-input>
                </el-form-item>
                <el-form-item label="expression" prop="expression">
                    <el-input placeholder="expression" v-model="itemForm.expression"></el-input>
                </el-form-item>
                <el-form-item label="face_probability" prop="face_probability">
                    <el-input placeholder="face_probability" v-model="itemForm.face_probability"></el-input>
                </el-form-item>
                <el-form-item label="face_shape" prop="face_shape">
                    <el-input placeholder="face_shape" v-model="itemForm.face_shape"></el-input>
                </el-form-item>
                <el-form-item label="face_token" prop="face_token">
                    <el-input placeholder="face_token" v-model="itemForm.face_token"></el-input>
                </el-form-item>
                <el-form-item label="gender" prop="gender">
                    <el-input placeholder="gender" v-model="itemForm.gender"></el-input>
                </el-form-item>
                <el-form-item label="glasses" prop="glasses">
                    <el-input placeholder="glasses" v-model="itemForm.glasses"></el-input>
                </el-form-item>
                <el-form-item label="landmark" prop="landmark">
                    <el-input placeholder="landmark" v-model="itemForm.landmark"></el-input>
                </el-form-item>
                <el-form-item label="landmark72" prop="landmark72">
                    <el-input placeholder="landmark72" v-model="itemForm.landmark72"></el-input>
                </el-form-item>
                <el-form-item label="location" prop="location">
                    <el-input placeholder="location" v-model="itemForm.location"></el-input>
                </el-form-item>
                <el-form-item label="race" prop="race">
                    <el-input placeholder="race" v-model="itemForm.race"></el-input>
                </el-form-item>

            </el-form>

            <div slot="footer" class="dialog-footer"
                 style="position: absolute; display: block; width: 100%; right: 50px; top: 50px;">
                <el-button @click="itemDialog.visable = false">取 消</el-button>
                <el-button type="primary" @click="getAipInfo()">检测</el-button>
                <el-button v-if="itemDialog.title == '添加'" type="primary" @click="addOne('itemForm')">
                    {{itemDialog.title}}
                </el-button>
                <el-button v-if="itemDialog.title == '修改'" type="primary" @click="updateOne('itemForm')">
                    {{itemDialog.title}}
                </el-button>
                <el-button v-if="itemDialog.title == '删除'" type="primary" @click="deleteOne('itemForm')">
                    {{itemDialog.title}}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  methods: {
    handleAdd () {
      this.itemDialog.visable = true
      this.itemDialog.title = '添加'
      this.$store.dispatch('star/setForm', -1)
    },
    handleUpdate (index) {
      this.itemDialog.visable = true
      this.itemDialog.title = '修改'
      this.$store.dispatch('star/setForm', index)
    },
    handleDelete (index) {
      this.itemDialog.visable = true
      this.itemDialog.title = '删除'
      this.$store.dispatch('star/setForm', index)
    },
    addOne (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store.dispatch('star/addOne')
        } else {
          console.log(valid)
          this.$message.error('error submit!!')
          return false
        }
      })
    },
    updateOne (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store.dispatch('star/updateOne')
        } else {
          this.$message.error('error submit!!')
          return false
        }
      })
    },
    deleteOne (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store.dispatch('star/deleteOne')
        } else {
          this.$message.error('error submit!!')
          return false
        }
      })
    },
    handleSizeChange (val) {
      this.$store.dispatch('star/setPageSize', val)
    },
    handleCurrentChange (val) {
      this.$store.dispatch('star/setPageNumber', val)
    },
    uploadImage (event) {
      this.$store.dispatch('star/uploadImage', event)
    },
    getAipInfo (event) {
      this.$store.dispatch('star/getAipInfo', event)
    },
    getAllWithFilter () {
      this.$store.dispatch('star/getAll', {
        gender: ((this.genderSelectionResult === '') || (this.genderSelectionResult === 'all')) ? '' : this.genderSelectionResult,
        faceShape: this.faceShapeSelectionResult === '' || this.faceShapeSelectionResult === 'all' ? '' : this.faceShapeSelectionResult
      })
    }
  },
  components: {},
  computed: {
    ...mapGetters({
      list: 'star/list',
      listInfo: 'star/listInfo',
      itemForm: 'star/itemForm',
      itemRule: 'star/itemRule',
      itemDialog: 'star/itemDialog'
    })
  },
  data () {
    return {
      src: '',
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
      faceShapeSelectionResult: ''
    }
  },
  mounted () {
    this.$store.dispatch('star/getAll')
  }
}
</script>
<style scoped="scoped">

    .img-upload-btn {
        cursor: pointer;
        display: inline-block;
        text-align: center;
        white-space: nowrap;
        position: relative;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        width: 240px;
        min-height: 240px;
        font-size: 0;
        line-height: 0;
    }

    .img-upload-btn:hover,
    #avatar-uploader-icon:hover {
        border-color: #409EFF;
    }

    .img-upload-btn img {
        position: relative;
        width: 100%;
    }

    .img-upload-btn input[type=file] {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        text-align: right;
        filter: alpha(opacity=0);
        opacity: 0;
        outline: none;
        cursor: inherit;
    }

    #avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 100%;
        height: 100%;
        line-height: 240px;
        text-align: center;
    }

</style>
