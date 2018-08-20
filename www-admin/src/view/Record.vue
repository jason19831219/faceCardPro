<template xmlns:div="http://www.w3.org/1999/html">
  <div>
    <el-table
      :data="list"
      style="width: 100%; "
      row-style="height: 100px"
      ref="table">
      <el-table-column
        prop="user"
        label="用户"
        show-overflow-tooltip
        width="800">

        <template slot-scope="scope">
          <p>{{scope.row.user.wxUserInfo.openId}}</p>
          <p>{{scope.row.user.wxUserInfo.nickName}}</p>
          <p>{{scope.row.user.wxUserInfo.city}}</p>
          <p>{{scope.row.user.wxUserInfo.country}}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="faceCard"
        label="脸卡id"
        width="800"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <p>{{scope.row.faceCard.id}}</p>
          <p>{{scope.row.faceCard.district}}</p>
          <p>{{scope.row.faceCard.createDate}}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="event"
        label="行为"
        width="200"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="createDate"
        label="createDate"
        width="200">
      </el-table-column>
      <!--<el-table-column-->
        <!--prop="updateDate"-->
        <!--sortable-->
        <!--label="updateDate"-->
        <!--width="200">-->
      <!--</el-table-column>-->
      <!--<el-table-column-->
        <!--fixed="right"-->
        <!--label="操作"-->
        <!--width="400">-->
        <!--<template slot-scope="scope">-->
          <!--<el-button-->
            <!--type="primary"-->
            <!--@click="handleUpdate(scope.$index)"-->
            <!--size="small">-->
            <!--修改-->
          <!--</el-button>-->
          <!--<el-button-->
            <!--size="small"-->
            <!--type="danger"-->
            <!--@click="handleDelete(scope.$index)">删除-->
          <!--</el-button>-->
        <!--</template>-->
      <!--</el-table-column>-->
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
import $ from 'jquery'
export default {
  methods: {
    handleSizeChange (val) {
      this.$store.dispatch('view/setPageSize', val)
    },
    handleCurrentChange (val) {
      console.log($('el-pagination'))
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
