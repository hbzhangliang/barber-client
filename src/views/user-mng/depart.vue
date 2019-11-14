<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="pageParams.filter.lk_name" placeholder="模糊查询名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handle(null,'add')">
        新增
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="refresh">
        重置
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        reviewer
      </el-checkbox>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="pageParams.data"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="编号" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="name" sortable="custom" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" @click="handle(row,'edit')">
            编辑
          </el-button>
          <el-button  type="success" @click="handle(row,'view')">
            查看
          </el-button>
          <el-button  type="danger" @click="handle(row,'del')">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="pageParams.totalRows>0" :total="pageParams.totalRows" :page.sync="pageParams.page" :limit.sync="pageParams.pageSize" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="name" prop="name">
          <el-input v-model="temp.name" :readonly="dialogStatus=='view'"/>
        </el-form-item>
        <el-form-item label="address">
          <el-input v-model="temp.address" :readonly="dialogStatus=='view'" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
        <el-form-item label="photo">
          <el-input v-model="temp.photo" :readonly="dialogStatus=='view'" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
        <el-form-item label="introduce">
          <el-input v-model="temp.introduce" :readonly="dialogStatus=='view'" :autosize="{ minRows: 4, maxRows: 6}" type="textarea" placeholder="Please input" />
        </el-form-item>
        <el-form-item label="remark">
          <el-input v-model="temp.remark" :readonly="dialogStatus=='view'" :autosize="{ minRows: 4, maxRows: 6}" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" v-if="dialogStatus!='view'" @click="saveOrUpdate()">
          确认
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { departListAll, departList, departGet, departSave, departDel } from '@/api/user'
  import waves from '@/directive/waves' // waves directive
  import { parseTime } from '@/utils'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination

  const calendarTypeOptions = [
    { key: 'CN', display_name: 'China' },
    { key: 'US', display_name: 'USA' },
    { key: 'JP', display_name: 'Japan' },
    { key: 'EU', display_name: 'Eurozone' }
  ]

  // arr to obj, such as { CN : "China", US : "USA" }
  const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  }, {})

  export default {
    name: 'ComplexTable',
    components: { Pagination },
    directives: { waves },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'info',
          deleted: 'danger'
        }
        return statusMap[status]
      },
      typeFilter(type) {
        return calendarTypeKeyValue[type]
      }
    },
    data() {
      return {
        pageParams: {
          page: 1,
          pageSize: 10,
          totalRows: 0,
          totalPage: 1,
          orderBy: 'id',
          direction: 'desc',
          filter: {
            lk_name:null
          },
          data: []
        },
        listLoading: false,

        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          add:'新建门面店',
          edit: '编辑门面店',
          view: '查看门面店'
        },
        dialogPvVisible: false,

        tableKey: 0,

        listQuery: {
          page: 1,
          limit: 20,
          importance: undefined,
          title: undefined,
          type: undefined,
          sort: '+id'
        },

        importanceOptions: [1, 2, 3],
        calendarTypeOptions,
        sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
        statusOptions: ['published', 'draft', 'deleted'],
        showReviewer: false,
        temp: {
          id:null,
          name:null,
          address:null,
          photo:null,
          introduce:null,
          remark:null,
          status:null,
          flag:null
        },


        pvData: [],
        rules: {
          type: [{ required: true, message: 'type is required', trigger: 'change' }],
          timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
          title: [{ required: true, message: 'title is required', trigger: 'blur' }]
        },
        downloadLoading: false
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        console.log(this.pageParams)
        departList(this.pageParams).then(response => {
          this.pageParams=response.data
          this.listLoading = false
        })
      },
      handleFilter() {
        this.pageParams.page = 1
        this.getList()
      },
      handleModifyStatus(row, status) {
        this.$message({
          message: '操作Success',
          type: 'success'
        })
        row.status = status
      },
      sortChange(data) {
        const { prop, order } = data
        if(order!=null) {
          this.pageParams.orderBy = prop
          this.pageParams.direction = order === "ascending" ? "asc" : "desc"
          this.getList()
        }
      },
      resetTemp() {
        this.temp = {
          id: undefined,
          importance: 1,
          remark: '',
          timestamp: new Date(),
          title: '',
          status: 'published',
          type: ''
        }
      },
      saveOrUpdate(){
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            departSave(this.temp).then(() => {
              // this.pageParams.data.unshift(this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: 'Success',
                message: 'Created Successfully',
                type: 'success',
                duration: 2000
              })
              this.getList()
            })
          }
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
            this.temp.author = 'vue-element-admin'
            createArticle(this.temp).then(() => {
              this.list.unshift(this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: 'Success',
                message: 'Created Successfully',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      handleDelete(row) {
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      },
      handleFetchPv(pv) {
        fetchPv(pv).then(response => {
          this.pvData = response.data.pvData
          this.dialogPvVisible = true
        })
      },
      handleDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
          const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'table-list'
          })
          this.downloadLoading = false
        })
      },
      refresh(){
        this.pageParams.filter={
          lk_name:null
        }
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      },
      handle(row,type){
        let _this=this
        switch (type) {
          case "add":{
            this.resetTemp()
            this.dialogStatus = 'add'
            this.dialogFormVisible = true
            this.$nextTick(() => {
              this.$refs['dataForm'].clearValidate()
            })
            break;
          }
          case "edit":{
            this.temp = Object.assign({}, row) // copy obj
            this.dialogStatus = 'edit'
            this.dialogFormVisible = true
            this.$nextTick(() => {
              this.$refs['dataForm'].clearValidate()
            })
           break;
          }
          case "view":{
            this.temp = Object.assign({}, row) // copy obj
            this.dialogStatus = 'view'
            this.dialogFormVisible = true
            this.$nextTick(() => {
              this.$refs['dataForm'].clearValidate()
            })
            break;
          }
          case "del":{
            let d=[]
            d.push(row.id)
            departDel({ids:d}).then(() => {
              _this.getList()
            })
            break;
          }
          default:break;
        }
      }
    }
  }
</script>
