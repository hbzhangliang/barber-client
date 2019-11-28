<template>
  <el-card :body-style="{ padding: '10px' }" style="padding: 0px;margin: 2px;">
    <div class="filter-container">
      <div class="searchBar">
        <el-card class="sf-box-card" style="margin-bottom: 5px;" :body-style="{ padding: '10px' }">
          <el-form>
            <el-row>
              <el-col :span="11">
                账号：<input v-model="pageParams.filter.lk_account" class="sf-search-input-300" placeholder="请输入账号,模糊查询"/>
              </el-col>
              <el-col :span="11">
                类型：<input v-model="pageParams.filter.lk_stype" class="sf-search-input-300" placeholder="请输入类型,模糊查询"/>
              </el-col>

              <el-col :span="2">
                <div v-if="showSearchMore">
                  <el-button v-waves class="filter-item" type="primary" icon="el-icon-caret-top" @click="btnShowMore">缩起</el-button>
                </div>
                <div v-else>
                  <el-button v-waves class="filter-item" type="primary" icon="el-icon-caret-bottom" @click="btnShowMore">展开</el-button>
                </div>
              </el-col>
            </el-row>
            <el-collapse-transition>
              <div v-show="showSearchMore">
                <el-row style="margin-bottom: 10px;">
                  <el-col :span="11">
                    电话：<input v-model="pageParams.filter.lk_phone" class="sf-search-input-300" placeholder="请输入电话,模糊查询" />
                  </el-col>
                  <el-col :span="11">
                    备注：<input v-model="pageParams.filter.lk_remark" class="sf-search-input-300" placeholder="请输入备注,模糊查询" />
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="11">
                    状态：<input v-model="pageParams.filter.lk_status" class="sf-search-input-300" placeholder="请输入状态,模糊查询" />
                  </el-col>
                </el-row>
              </div>
            </el-collapse-transition>
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
      <el-button v-if="multipleSelection.length>0" v-waves type="danger" class="filter-item" @click="delBatch"><i class="el-icon-delete" />批量删除</el-button>
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
                       type="selection"
      />
      <el-table-column prop="" label="图像" align="center">
        <template scope="scope">
          <img v-if="scope.row.photo!=null&&scope.row.photo.trim().length>0" :src="scope.row.photo" class="sf-list-img">
        </template>
      </el-table-column>
      <el-table-column v-for="item in showFact" align="center" :show-overflow-tooltip="true" :sortable="item.sortable" :prop="item.prop" :label="item.label" />

      <el-table-column label="操作" align="center" width="200" fixed="right" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button-group>
            <el-button type="primary" icon="el-icon-edit" @click="handle(row,'edit')" />
            <el-button type="success" icon="el-icon-view" @click="handle(row,'view')" />
            <el-button type="danger" icon="el-icon-delete" @click="handle(row,'del')" />
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="pageParams.totalRows>0" :total="pageParams.totalRows" :page.sync="pageParams.page" :limit.sync="pageParams.pageSize" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-card class="sf-box-card">
        <el-form ref="dataForm" :rules="rules" :model="bean" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
          <el-form-item label="account" prop="account">
            <el-input v-model="bean.account" :readonly="dialogStatus=='view'" />
          </el-form-item>
          <el-form-item label="password" prop="password">
            <el-input v-model="bean.password" :readonly="dialogStatus=='view'" />
          </el-form-item>
          <el-form-item label="stype" prop="stype">
            <el-input v-model="bean.stype" :readonly="dialogStatus=='view'" />
          </el-form-item>
          <el-form-item label="phone" prop="phone">
            <el-input v-model="bean.phone" :readonly="dialogStatus=='view'" />
          </el-form-item>
          <el-form-item label="remark">
            <el-input v-model="bean.remark" :readonly="dialogStatus=='view'" :autosize="{ minRows: 4, maxRows: 6}" type="textarea" placeholder="Please input" />
          </el-form-item>
          <el-form-item label="status" prop="status">
          <el-input v-model="bean.status" :readonly="dialogStatus=='view'" />
        </el-form-item>
          <el-form-item label="flag" prop="flag">
            <el-input v-model="bean.flag" :readonly="dialogStatus=='view'" />
          </el-form-item>

        </el-form>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button v-if="dialogStatus!='view'" type="primary" @click="saveOrUpdate()">
          确认
        </el-button>
      </div>
    </el-dialog>



    <el-dialog title="选择显示项" :visible.sync="showFlag" width="50%" :close-on-click-modal="false">
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
  </el-card>
</template>

<script>
  import { accountListAll, accountList, accountGet, accountSave, accountDel } from '@/api/user'
  import waves from '@/directive/waves' // waves directive
  import { parseTime } from '@/utils'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import Kanban from '@/components/Kanban'

  export default {
    name: 'account',
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
            lk_account:null,
            lk_stype:null,
            lk_phone:null,
            lk_remark:null,
            lk_status:null
          },
          data: []
        },
        listLoading: false,

        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          add:'新建账号',
          edit: '编辑账号',
          view: '查看账号'
        },

        multipleSelection:[],
        bean: {
          id:null,
          account:null,
          password:null,
          stype:null,
          phone:null,
          remark:null,
          status:null,
          flag:null
        },
        showSearchMore:false,


        rules: {
          // type: [{ required: true, message: 'type is required', trigger: 'change' }],
          // timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
          // title: [{ required: true, message: 'title is required', trigger: 'blur' }]
        },
        downloadLoading: false,
        showsOrgin:[
          {key: 1, prop: 'id', label: '编号', sortable: 'custom', type: '', orgin: 'id',},
          {key: 2, prop: 'account', label: '名称', sortable: 'custom', type: '', orgin: 'account'},
          {key: 3, prop: 'password', label: '密码', sortable: 'custom', type: '', orgin: 'password'},
          {key: 4, prop: 'stype', label: '类型', sortable: 'custom', type: '', orgin: 'stype'},
          {key: 5, prop: 'phone', label: '手机', sortable: 'custom', type: '', orgin: 'phone'},
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
        showList:["id","account","password","stype","phone","remark"]


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
        accountList(this.copyParams()).then(response => {
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
          account:null,
          password:null,
          stype:null,
          phone:null,
          remark:null,
          status:null,
          flag:null
        }
      },
      refresh(){
        this.pageParams.filter={
          lk_account:null,
          lk_stype:null,
          lk_phone:null,
          lk_remark:null,
          lk_status:null
        }
      },
      saveOrUpdate(){
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            accountSave(this.bean).then(() => {
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
              accountDel({ids:d}).then(() => {
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
          accountDel({ids:_this.multipleSelection}).then(() => {
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

  .sf-kanban {
    &.todo {
      .board-column-header {
        background: #4A9FF9;
      }
    }
    &.working {
      .board-column-header {
        background: #f9944a;
      }
    }
    &.done {
      .board-column-header {
        background: #2ac06d;
      }
    }
  }
</style>
