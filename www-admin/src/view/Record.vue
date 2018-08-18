<template xmlns:div="http://www.w3.org/1999/html">
  <div>
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
        prop="recommendPic"
        label="recommendPic"
        width="400"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="likeNum"
        label="likeNum"
        width="400"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="likeUserIds"
        label="likeUserIds"
        width="400"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="clickNum"
        label="clickNum"
        width="400"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="isTop"
        label="isTop"
        width="400"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="street"
        label="street"
        width="400"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="district"
        label="district"
        width="400"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="city"
        label="city"
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
        prop="hairParam"
        label="hairParam"
        width="200"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="hairQuality"
        label="hairQuality"
        width="200"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="hairQuantity"
        label="hairQuantity"
        width="200"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="hairGranularity"
        label="hairGranularity"
        width="200"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="hairCrispation"
        label="hairCrispation"
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
        prop="editDate"
        label="editDate"
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
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  methods: {
    handleSizeChange (val) {
      this.$store.dispatch('view/setPageSize', val)
    },
    handleCurrentChange (val) {
      this.$store.dispatch('view/setPageNumber', val)
    }
  },
  components: {},
  computed: {
    ...mapGetters({
      list: 'view/list',
      listInfo: 'view/listInfo'
    })
  },
  data () {
    return {
      src: ''
    }
  },
  mounted () {
    this.$store.dispatch('view/getAll')
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
