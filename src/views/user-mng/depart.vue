<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="searchBar">
        <el-card class="sf-box-card" style="margin-bottom: 5px;" :body-style="{ padding: '10px' }">
          <el-form>
            <el-row>
            <el-col :span="11">
              名称:<el-input v-model="pageParams.filter.lk_name" class="filter-item w-300"  placeholder="请输入名称,模糊查询"></el-input>
            </el-col>
            <el-col :span="11">
              地址:<el-input v-model="pageParams.filter.lk_address" class="filter-item w-300" placeholder="请输入地址,模糊查询"></el-input>
            </el-col>

            <el-col :span="2">
              <div v-if="showSearchMore">
                <el-button v-waves class="filter-item" type="primary" icon="el-icon-caret-top"    @click="btnShowMore">缩起</el-button>
              </div>
              <div v-else>
                <el-button v-waves class="filter-item" type="primary" icon="el-icon-caret-bottom"  @click="btnShowMore">展开</el-button>
              </div>
            </el-col>
          </el-row>
          <el-row v-show="showSearchMore">
            <el-col :span="11">
              图片:<el-input v-model="pageParams.filter.lk_phone" class="filter-item w-300"  placeholder="请输入图片,模糊查询"></el-input>
            </el-col>
            <el-col :span="11">
              简介:<el-input v-model="pageParams.filter.lk_introduce" class="filter-item w-300" placeholder="请输入简介,模糊查询"></el-input>
            </el-col>
          </el-row>
          <el-row v-show="showSearchMore">
            <el-col :span="11">
              备注:<el-input v-model="pageParams.filter.lk_remark" class="filter-item w-300"  placeholder="请输入备注,模糊查询"></el-input>
            </el-col>
            <el-col :span="11">
              状态:<el-input v-model="pageParams.filter.lk_status" class="filter-item w-300" placeholder="请输入状态,模糊查询"></el-input>
            </el-col>
          </el-row>
        </el-form>
        </el-card>
      </div>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="refresh">
        重置
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handle(null,'add')">
        新增
      </el-button>

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-view" @click="showModify">
        展示
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
      <el-button v-waves  type="danger" v-if="multipleSelection.length>0"  class="filter-item" @click="delBatch"><i class="el-icon-delete"></i>批量删除</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="pageParams.data"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column width="50"
                       fixed="left"
                       label="选择"
                       type="selection">
      </el-table-column>
      <el-table-column  prop="" label="图像" align="center">
        <template scope="scope">
          <img v-if="scope.row.photo!=null&&scope.row.photo.trim().length>0" :src="scope.row.photo" class="sf-list-img"/>
        </template>
      </el-table-column>
      <el-table-column  align="center" :show-overflow-tooltip="true" v-for="item in showFact" :sortable="item.sortable" :prop="item.prop" :label="item.label">
      </el-table-column>

      <el-table-column label="操作" align="center" width="230"  fixed="right" class-name="small-padding fixed-width">
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
      <el-card class="sf-box-card">
      <el-form ref="dataForm" :rules="rules" :model="bean" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="name" prop="name">
          <el-input v-model="bean.name" :readonly="dialogStatus=='view'"/>
        </el-form-item>
        <el-form-item label="address">
          <el-input v-model="bean.address" :readonly="dialogStatus=='view'" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
        <el-form-item label="photo">
          <el-input v-model="bean.photo" :readonly="dialogStatus=='view'" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
        <el-form-item label="introduce">
          <el-input v-model="bean.introduce" :readonly="dialogStatus=='view'" :autosize="{ minRows: 4, maxRows: 6}" type="textarea" placeholder="Please input" />
        </el-form-item>
        <el-form-item label="remark">
          <el-input v-model="bean.remark" :readonly="dialogStatus=='view'" :autosize="{ minRows: 4, maxRows: 6}" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" v-if="dialogStatus!='view'" @click="saveOrUpdate()">
          确认
        </el-button>
      </div>
    </el-dialog>



    <el-dialog title="选择显示项" :visible.sync="showFlag" width="50%">
      <el-card class="sf-box-card">
      <div class="components-container sf-board">
        <Kanban :list="hasShow" :group="group" class="sf-kanban done" header-text="已显示项" />
        <Kanban :list="notShow" :group="group" class="sf-kanban working" header-text="未显示项" />
      </div>

      </el-card>

      <div slot="footer" class="dialog-footer">
        <el-button @click="showFlag = false">
          取消
        </el-button>
        <el-button type="primary" @click="showChange()">
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
  import Kanban from '@/components/Kanban'

  export default {
    name: 'ComplexTable',
    components: { Pagination,Kanban },
    directives: { waves },
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
            lk_name:null,
            lk_address:null,
            lk_phone:null,
            lk_introduce:null,
            lk_remark:null,
            lk_status:null
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

        multipleSelection:[],
        bean: {
          id:null,
          name:null,
          address:null,
          photo:null,
          introduce:null,
          remark:null,
          status:null,
          flag:null
        },
        showSearchMore:false,


        rules: {
          type: [{ required: true, message: 'type is required', trigger: 'change' }],
          timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
          title: [{ required: true, message: 'title is required', trigger: 'blur' }]
        },
        downloadLoading: false,
        showsOrgin:[
          {key: 1, prop: 'id', label: '编号', sortable: 'custom', type: '', orgin: 'id',},
          {key: 2, prop: 'name', label: '名称', sortable: 'custom', type: '', orgin: 'name'},
          {key: 3, prop: 'address', label: '地址', sortable: 'custom', type: '', orgin: 'address'},
          {key: 4, prop: 'photo', label: '图片', sortable: 'custom', type: '', orgin: 'photo'},
          {key: 5, prop: 'introduce', label: '介绍', sortable: 'custom', type: '', orgin: 'introduce'},
          {key: 6, prop: 'remark', label: '备注', sortable: 'custom', type: '', orgin: 'remark'},
          {key: 7, prop: 'status', label: '状态', sortable: 'custom', type: '', orgin: 'status'},
          {key: 8, prop: 'flag', label: '删除位', sortable: 'custom', type: '', orgin: 'flag'},
          {key: 9, prop: 'createTimeStr', label: '创建时间', sortable: 'custom', type: 'date', orgin: 'createTime'},
          {key: 10, prop: 'createBy', label: '创建人', sortable: 'custom', type: '', orgin: 'createBy'},
          {key: 11, prop: 'updateTimeStr', label: '修改时间', sortable: 'custom', type: 'date', orgin: 'updateTime'},
          {key: 12, prop: 'updateBy', label: '修改人', sortable: 'custom', type: '', orgin: 'updateBy'}
        ],
        showFact:[],
        showFlag:false,
        group:"show",
        hasShow:[],
        notShow:[],
        showList:["id","name","address","photo","introduce","remark"]


      }
    },
    created() {
      this.getList()
      this.initShow()
    },
    methods: {
      //搜索展示更多条件查询
      btnShowMore(){
        this.showSearchMore=!this.showSearchMore
      },
      //初始化展示字段
      initShow(){
          let _this=this
        _this.hasShow=[]
        _this.notShow=[]
        _this.showFact=[]
        _this.showsOrgin.forEach(p=>{
           var flag=false
          _this.showList.forEach(q=>{
            if(p.prop==q){
              flag=true
            }
          })
          if(flag){
            _this.hasShow.push({prop:p.prop,name:p.label})
            _this.showFact.push(p)
          }
          else{
            _this.notShow.push({prop:p.prop,name:p.label})
          }
        })
      },
      //展示字段修改
      showChange(){
        let _this=this
        _this.showList=[]
        _this.hasShow.forEach(p=>{
          _this.showList.push(p.prop)
        })
        this.initShow()
        this.showFlag=false
      },
      //显示 修改的页面
      showModify(){
        this.showFlag=true
      },
      //拷贝入参
      copyParams(){
        var pm={
          page: this.pageParams.page,
          pageSize:this.pageParams.pageSize,
          totalRows: this.pageParams.totalRows,
          totalPage: this.pageParams.totalPage,
          orderBy: this.pageParams.orderBy,
          direction: this.pageParams.direction,
          filter: this.pageParams.filter,
          data:[]
        }
        return pm;
      },

      //列表查询
      getList() {
        this.listLoading = true
        console.log(this.copyParams())
        departList(this.copyParams()).then(response => {
          this.pageParams=response.data
          if(this.pageParams!=null&&this.pageParams.data!=null) {
            this.pageParams.data.forEach(p => {
                if(p.createTime!=null) {
                  p.createTimeStr = parseTime(p.createTime)
                }
                if(p.updateTime!=null) {
                  p.updateTimeStr = parseTime(p.updateTime)
                }
            })
          }
          this.listLoading = false
        })
      },
      //搜索事件
      handleFilter() {
        this.pageParams.page = 1
        this.getList()
      },
      //排序修改
      sortChange(data) {
        console.log(data)
        const { prop, order } = data
        if(order!=null) {
          this.pageParams.orderBy = prop
          this.pageParams.direction = order === "ascending" ? "asc" : "desc"
          this.getList()
        }
      },
      resetBean() {
        this.bean = {
          id:null,
          name:null,
          address:null,
          photo:null,
          introduce:null,
          remark:null,
          status:null,
          flag:null
        }
      },
      refresh(){
        this.pageParams.filter={
          lk_name:null,
          lk_address:null,
          lk_phone:null,
          lk_introduce:null,
          lk_remark:null,
          lk_status:null
        }
      },
      saveOrUpdate(){
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            departSave(this.bean).then(() => {
              this.dialogFormVisible = false
              this.$message({
                type: 'success',
                message: '保存成功'
              });
              this.getList()
            })
          }
        })
      },
      handleDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['id', 'name', 'address', 'photo', 'introduce','remark']
          const filterVal = ['id', 'name', 'address', 'photo', 'introduce','remark']
          const data = this.formatJson(filterVal, this.pageParams.data)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'table-list'
          })
          this.downloadLoading = false
        })
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
            this.resetBean()
            this.dialogStatus = 'add'
            this.dialogFormVisible = true
            this.$nextTick(() => {
              this.$refs['dataForm'].clearValidate()
            })
            break;
          }
          case "edit":{
            this.bean = Object.assign({}, row) // copy obj
            this.dialogStatus = 'edit'
            this.dialogFormVisible = true
            this.$nextTick(() => {
              this.$refs['dataForm'].clearValidate()
            })
           break;
          }
          case "view":{
            this.bean = Object.assign({}, row) // copy obj
            this.dialogStatus = 'view'
            this.dialogFormVisible = true
            this.$nextTick(() => {
              this.$refs['dataForm'].clearValidate()
            })
            break;
          }
          case "del":{
            this.$confirm('确认删除此记录?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let d=[]
              d.push(row.id)
              departDel({ids:d}).then(() => {
                _this.getList()
                _this.$message({
                  type: 'success',
                  message: '删除成功'
                });
              })
            }).catch(() => {
              _this.$message({
                type: 'info',
                message: '已取消删除'
              });
            });
            break;
          }
          default:break;
        }
      },

      //批量删除
      handleSelectionChange(val){
        let _this=this
        var delIds=[]
        val.forEach(p=>{
          delIds.push(p.id)
        })
        _this.multipleSelection=delIds
      },
      delBatch(){
        let _this=this
        this.$confirm('确认批量删除记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let d=[]
          departDel({ids:_this.multipleSelection}).then(() => {
            _this.multipleSelection=[]
            _this.getList()
            _this.$message({
              type: 'success',
              message: '删除成功'
            });
          })
        }).catch(() => {
          _this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    }
  }
</script>
<style lang="scss">




</style>
