<template>
  <el-card :body-style="{ padding: '10px' }" style="padding: 0px;margin: 2px;">
    <div class="filter-container">
      <div class="searchBar">
        <el-card class="sf-box-card" style="margin-bottom: 5px;" :body-style="{ padding: '10px' }">
          <el-form>
            <el-row>
              <el-col :span="11">
                <span class="sf-search-left">编码：</span><input v-model="pageParams.filter.lk_code" class="sf-search-input-300" placeholder="请输入编码,模糊查询"/>
              </el-col>
              <el-col :span="11">
                <span class="sf-search-left">名称：</span><input v-model="pageParams.filter.lk_name" class="sf-search-input-300" placeholder="请输入名称,模糊查询"/>
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
                <el-row>
                  <el-col :span="11">
                    <span class="sf-search-left">备注：</span><input v-model="pageParams.filter.lk_remark" class="sf-search-input-300" placeholder="请输入备注,模糊查询" />
                  </el-col>
                  <el-col :span="11">
                    <span class="sf-search-left">状态：</span><input v-model="pageParams.filter.lk_status" class="sf-search-input-300" placeholder="请输入状态,模糊查询" />
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="60%">
      <el-card class="sf-box-card">
        <div slot="header" class="clearfix">
          <span style="font-size: large">节点信息</span>
        </div>
        <el-form ref="dataForm" :rules="rules" :model="bean" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
          <el-form-item label="code" prop="name">
            <el-input v-model="bean.code" :readonly="dialogStatus=='view'" />
          </el-form-item>
          <el-form-item label="name" prop="name">
            <el-input v-model="bean.name" :readonly="dialogStatus=='view'" />
          </el-form-item>
          <el-form-item label="remark">
            <el-input v-model="bean.remark" :readonly="dialogStatus=='view'" :autosize="{ minRows: 4, maxRows: 6}" type="textarea" placeholder="Please input" />
          </el-form-item>
        </el-form>
      </el-card>

      <el-card class="sf-box-card" v-if="dialogStatus!='add'">
        <div slot="header" class="clearfix">
          <span style="font-size: large">子项信息</span>
        </div>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="childAdd()" v-if="dialogStatus!='view'">
          新增子项
        </el-button>
        <el-table
          :data="dictChildren"
          style="width: 100%">

            <el-table-column prop="id" label="编号" align="center" min-width="20%">
            </el-table-column>
            <el-table-column prop="code" label="编码" align="center" min-width="20%">
              <template scope="scope">
                <el-input v-show="scope.row.edit" size="small" v-model="scope.row.code"></el-input>
                <span v-show="!scope.row.edit">{{ scope.row.code }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="名称" align="center" min-width="20%">
              <template scope="scope">
                <el-input v-show="scope.row.edit" size="small" v-model="scope.row.name"></el-input>
                <span v-show="!scope.row.edit">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" align="center" min-width="20%">
              <template scope="scope">
                <el-input v-show="scope.row.edit" size="small" v-model="scope.row.remark"></el-input>
                <span v-show="!scope.row.edit">{{ scope.row.remark }}</span>
              </template>
            </el-table-column>

            <el-table-column  label="操作" width="210" fixed="right" v-if="dialogStatus!='view'">
              <template slot-scope="scope">
                <el-button v-if="!scope.row.edit" size="mini" type="primary" icon="el-icon-edit" @click="childEdit(scope.row)"></el-button>
                <el-button v-if="scope.row.edit" size="mini" type="success" icon="el-icon-check" @click="childSave(scope.row)"></el-button>
                <el-button v-if="scope.row.edit" size="mini" type="info" icon="el-icon-close" @click="childCancel(scope.row)"></el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="childDel(scope.row)"></el-button>
              </template>
            </el-table-column>
        </el-table>
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
  import { dictListAll, dictListChildren,dictList, dictGet, dictSave, dictDel } from '@/api/user'
  import waves from '@/directive/waves' // waves directive
  import { parseTime } from '@/utils'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import Kanban from '@/components/Kanban'

  export default {
    name: 'dict',
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
            lk_code:null,
            lk_name:null,
            lk_remark:null,
            lk_status:null,
            eq_parentId:-1,
          },
          data: []
        },
        listLoading: false,

        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          add:'新建字典项',
          edit: '编辑字典项',
          view: '查看字典项'
        },

        multipleSelection:[],
        bean: {
          id:null,
          code:null,
          name:null,
          remark:null,
          parentId:null,
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
          {key: 2, prop: 'code', label: '编码', sortable: 'custom', type: '', orgin: 'code'},
          {key: 3, prop: 'name', label: '名称', sortable: 'custom', type: '', orgin: 'name'},
          {key: 4, prop: 'parentId', label: '父节点', sortable: 'custom', type: '', orgin: 'parentId'},
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
        showList:["id","code","name","parentId","remark"],

        dictChildren:[]


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
        dictList(this.copyParams()).then(response => {
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
          code:null,
          name:null,
          remark:null,
          parentId:null,
          status:null,
          flag:null,
        }
      },
      refresh(){
        this.pageParams.filter={
          lk_code:null,
          lk_name:null,
          lk_remark:null,
          lk_status:null,
          eq_parentId:-1
        }
      },
      saveOrUpdate(){
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            dictSave(this.bean).then(() => {
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
            this.bean.parentId=-1
            this.dialogStatus = 'add'
            this.dialogFormVisible = true
            this.$nextTick(() => {
              this.$refs['dataForm'].clearValidate()
            })
            this.dictChildren=[]
            break;
          }
          case "edit":{
            this.bean = Object.assign({}, row) // copy obj
            this.dialogStatus = 'edit'
            this.dialogFormVisible = true
            this.$nextTick(() => {
              this.$refs['dataForm'].clearValidate()
            })
            this.showDictchildList()
            break;
          }
          case "view":{
            this.bean = Object.assign({}, row) // copy obj
            this.dialogStatus = 'view'
            this.dialogFormVisible = true
            this.$nextTick(() => {
              this.$refs['dataForm'].clearValidate()
            })
            this.showDictchildList()
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
              dictDel({ids:d}).then(() => {
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
          dictDel({ids:_this.multipleSelection}).then(() => {
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
      },
      childAdd(){
        let _this=this
        var d=[]
        d.push({
          id:null,
          code:null,
          name:null,
          remark:null,
          parentId:_this.bean.id,
          status:null,
          flag:null,
          edit:true
        })
        _this.dictChildren.forEach(p=>{
          d.push(p)
        })
        _this.dictChildren=d
      },
      childEdit(item){
        this.dictChildren.forEach(p=>{
          if(p.id==item.id){
            p.edit=true
          }
        })
      },
      showDictchildList(){
        let _this=this
        dictListChildren({code:_this.bean.code}).then(p=>{
          if(p.data!=null) {
            p=p.data
            p.forEach(v => {
              v.edit = false
            })
            _this.dictChildren = p
          }
        })
      },
      childSave(item){
        let _this=this
        dictSave(item).then(p=>{
          _this.$message({
            message: '保存字典数据成功',
            type: 'success'
          });
          //再取一遍数据
          dictListChildren({code:_this.bean.code}).then(p=>{
            if(p.data!=null) {
              p=p.data
              p.forEach(v => {
                v.edit = false
              })
              _this.dictChildren = p
            }
          })
        }).catch(function (error) {
          _this.$message.error('后端错误:'+error.message);
        })
      },
      childCancel(item){
        let _this=this
        this.dictChildren.forEach(p=>{
          if(p.id==item.id){
            p.edit=false
          }
        })

        let d=[]
        if(item.id==null){
          _this.dictChildren.forEach(p=>{
            if(p.id!=null) {
              d.push(p)
            }
          })
          _this.dictChildren=d
        }

      },
      childDel(item){
        if(item.id==null){
          this.$message({
            message: '此记录未保存到数据库，不需要删除',
            type: 'warning'
          });
          return
        }
        let _this=this
        _this.multipleSelection=[]
        _this.multipleSelection.push(item.id)
        this.$confirm('此操作将永久删除该字典项, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          dictDel({ids:_this.multipleSelection}).then(p=>{
            _this.$message({
              message: '删除字典数据成功',
              type: 'success'
            });
            var d=[]
            _this.dictChildren.forEach(p=>{
              if(p.id!=item.id){
                d.push(p)
              }
            })
            _this.dictChildren=d
          }).catch(function (error) {
            _this.$message.error('后端错误:'+error.message);
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
