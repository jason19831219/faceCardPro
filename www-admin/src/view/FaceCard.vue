<template xmlns:div="http://www.w3.org/1999/html">
  <div>
    <div>
      <el-button size="small" type="primary" @click="handleAdd('itemForm')">添加</el-button>
    </div>
    <el-table
      :data="list"
      style="width: 100%"
      ref="table">
      <el-table-column
        prop="author"
        label="author"
        width="400"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="facePhoto"
        label="facePhoto"
        width="400"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="sidePhoto"
        label="sidePhoto"
        width="400"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="backPhoto"
        label="backPhoto"
        width="400"
        show-overflow-tooltip>
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
        <el-form-item label="face">
          <span class="img-upload-btn">
            <i v-if="!itemForm.facePhoto" class="el-icon-plus uploader-icon"></i>
            <img v-if="itemForm.facePhoto" :src="itemForm.facePhoto"/>
            <input @change="uploadImage" type="file" accept="image/*" name="image"/>
          </span>
        </el-form-item>
        <el-form-item label="facePhoto" prop="facePhoto">
          <el-input placeholder="facePhoto" v-model="itemForm.facePhoto"></el-input>
        </el-form-item>
        <el-form-item label="side">
          <span class="img-upload-btn">
            <i v-if="!itemForm.sidePhoto" class="el-icon-plus uploader-icon"></i>
            <img v-if="itemForm.sidePhoto" :src="itemForm.sidePhoto"/>
            <input @change="uploadImage" type="file" accept="image/*" name="image"/>
          </span>
        </el-form-item>
        <el-form-item label="sidePhoto" prop="sidePhoto">
          <el-input placeholder="sidePhoto" v-model="itemForm.sidePhoto"></el-input>
        </el-form-item>
        <el-form-item label="back">
          <span class="img-upload-btn">
            <i v-if="!itemForm.backPhoto" class="el-icon-plus uploader-icon"></i>
            <img v-if="itemForm.backPhoto" :src="itemForm.backPhoto"/>
            <input @change="uploadImage" type="file" accept="image/*" name="image"/>
          </span>
        </el-form-item>
        <el-form-item label="backPhoto" prop="backPhoto">
          <el-input placeholder="backPhoto" v-model="itemForm.backPhoto"></el-input>
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

      <div slot="footer" class="dialog-footer">
        <el-button @click="itemDialog.visable = false">取 消</el-button>
        <el-button type="primary" @click="getAipInfo()">检测</el-button>
        <el-button v-if="itemDialog.title == '添加'" type="primary" @click="addOne('itemForm')">{{itemDialog.title}}
        </el-button>
        <el-button v-if="itemDialog.title == '修改'" type="primary" @click="updateOne('itemForm')">{{itemDialog.title}}
        </el-button>
        <el-button v-if="itemDialog.title == '删除'" type="primary" @click="deleteOne('itemForm')">{{itemDialog.title}}
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
      this.$store.dispatch('faceCard/setForm', -1)
    },
    handleUpdate (index) {
      this.itemDialog.visable = true
      this.itemDialog.title = '修改'
      this.$store.dispatch('faceCard/setForm', index)
    },
    handleDelete (index) {
      this.itemDialog.visable = true
      this.itemDialog.title = '删除'
      this.$store.dispatch('faceCard/setForm', index)
    },
    addOne (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store.dispatch('faceCard/addOne')
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
          this.$store.dispatch('faceCard/updateOne')
        } else {
          this.$message.error('error submit!!')
          return false
        }
      })
    },
    deleteOne (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store.dispatch('faceCard/deleteOne')
        } else {
          this.$message.error('error submit!!')
          return false
        }
      })
    },
    handleSizeChange (val) {
      this.$store.dispatch('faceCard/setPageSize', val)
    },
    handleCurrentChange (val) {
      this.$store.dispatch('faceCard/setPageNumber', val)
    },
    uploadImage (event) {
      this.$store.dispatch('faceCard/uploadImage', event)
    },
    getAipInfo (event) {
      this.$store.dispatch('faceCard/getAipInfo', event)
    }
  },
  components: {},
  computed: {
    ...mapGetters({
      list: 'faceCard/list',
      listInfo: 'faceCard/listInfo',
      itemForm: 'faceCard/itemForm',
      itemRule: 'faceCard/itemRule',
      itemDialog: 'faceCard/itemDialog'
    })
  },
  data () {
    return {
      src: ''
    }
  },
  mounted () {
    this.$store.dispatch('faceCard/getAll')
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
  .uploader-icon:hover {
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

  .uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100%;
    height: 100%;
    line-height: 240px;
    text-align: center;
  }

</style>
