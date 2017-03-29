<template lang="html">
  <div class="hbox flex1">
    <div class="flex1 vbox" style="margin-right:10px">
      <div class="buttons">
        <el-button icon="plus" @click="openAddmng">新增管理员</el-button>
        <el-button icon="check" @click="saveModule">保存授权</el-button>
      </div>  
      <div class="vbox flex1" >
        <hb-table url="manager/getManagers" 
          ref="managerTable" 
          :rowClick="managerTableRowClick" 
          :columns="columns" >
        </hb-table>  
      </div>
    </div>
    <div class="vbox tree-con" style="margin-right:10px">
        <div class="tree-title">角色列表</div>
        <div style="padding:10px;">
          <el-button icon="check" @click="saveManagerRole">分配角色</el-button>
        </div>
        <hb-table 
          url="role/getRoles" 
          ref="choseRoleTable" 
          showCheck="1" 
          showPage="1"  
          :columns="roleColumns">
            
        </hb-table>
    </div>
    <div class="vbox tree-con">
        <div class="tree-title">所有模块</div>
        <el-tree
          class="flex1"
          ref="menuTree"
          style="border:none;overflow: auto"
          :data="treeData"
          :props="props"
          node-key="id"
          :check-strictly="checkStrictly"
          show-checkbox>
        </el-tree>
    </div>
    <el-dialog title="新增管理员" size="tiny" v-model="addMng">
      <el-form :model="curMng" label-width="80px">
        <el-form-item label="登录账户">
          <el-input v-model="curMng.login_name" ></el-input>
        </el-form-item>
        <el-form-item label="登录密码">
          <el-input type="password" v-model="curMng.password" ></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input type="password" v-model="curMng.surepwd" ></el-input>
        </el-form-item>
        <el-form-item label="所属公司">
          <el-select 
            filterable
            remote
            v-model="curMng.company_id" 
            placeholder="请选择"
            :remote-method="loadCompanys"
            :loading="loading"
          >
            <el-option
              v-for="c in companys"
              :key="c.id"
              :label="c.name"
              :value="c.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addMng = false">取 消</el-button>
        <el-button type="primary">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import HbTable from './component/HbTable.vue'
import request from './request.js'

export default {
  components:{
    HbTable
  },
  beforeMount:function(){
    var me =this;
    request.get('module/getModuleTree').then(function(res){
         me.treeData =  res.data.data;
    });
  },
  data () {
    return {
        addMng:false,
        loading:false,
        companys:[],
        curMng:{
          company_id:'',
          company_name:'',
          login_name:'',
          password:'',
          surepwd:''
        },
        columns:[{
          property:"id",
          label:"用户ID",
          width:85
        },{
          property:"login_name",
          label:"账户名"
        }],
        roleColumns:[{
          property:"id",
          label:"角色ID",
          width:85
        },{
          property:"role_name",
          label:"角色名称"
        }],
        treeData:[],
        props: {
          key:'id',
          label: 'name',
          children: 'children'
        },
        checkStrictly:true,
        curManager:null
    }
  },
  methods: {
      openAddmng:function(){
        var me=this;
        me.addMng =true;
      },
      managerTableRowClick:function(curRow,oldRow){
        this.curManager = curRow;
        this.loadMngRoles();
        this.loadManagerModules();
      },
      saveModule:function(){
        var me=this;
        if(!me.curManager){
          me.$message('请选择一个用户');
          return;
        }
        var checkModules = me.$refs.menuTree.getCheckedKeys(false);
        request.post('manager/saveManagerModules',{
          managerId:me.curManager.id,
          moduleIds:JSON.stringify(checkModules)
        }).then(function(res){
          if(res.data.success){
            me.$message({message:"保存授权成功",type:'success'});
          }
        });
      },
      saveManagerRole:function(){
        var me=this;
        var choseRoles = me.$refs.choseRoleTable.getCheckedRows(true);
        if(choseRoles.length==0){
          me.$message('请选择角色')
          return;
        }
        request.post('manager/saveManagerRoles',{
          managerId:me.curManager.id,
          roleIds:JSON.stringify(choseRoles)
        }).then(function(res){
          if(res.data.success){
            me.$message({message:"分配成功",type:'success'});
            me.showRoleTable = false;
            me.loadManagerModules();
          }
        })
      },
      loadMngRoles:function(){
        var me=this;
        request.get('manager/getMngRoles',{mngId:me.curManager.id}).then(function(res){
          me.loading=false;
          var ids = [];
          for(var i=0;i<res.data.length;i++){
            ids.push(res.data[i].role_id);
          }
          me.$refs.choseRoleTable.toggleRowSelection(ids,true,true);
        })
      },
      loadManagerModules:function(){
        var me =this;
        request.get('manager/getModulesByManagerId',{managerId:me.curManager.id}).then(function(res){
            me.$refs.menuTree.setCheckedKeys(res.data,false);
        });
      },
      loadCompanys:function(query){
        var me=this;
        if(query!==''){
          me.loading = true;
          request.get('company/getCompanys',{query:query}).then(function(res){
            me.companys = res.data.data;
            me.loading = false;
          });
        }
      }
  }
}
</script>

<style lang="css" scoped>
.buttons{
  padding: 12px;
}
.tree-con{
  width:500px;
}
.tree-title{
  padding:10px;
  background-color: #eee;
}
</style>
