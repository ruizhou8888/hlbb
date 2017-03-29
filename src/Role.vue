<template lang="html">
  <div class="hbox flex1">
    <div class="flex1 vbox" style="border-right:1px solid #D9D9D9;padding-right:10px">
      <div class="buttons">
        <el-button icon="plus" @click="showAddRole">新增角色</el-button>
        <el-button icon="check" @click="saveModule">保存授权</el-button>
      </div>  
      <div class="vbox flex1">
        <hb-table url="role/getRoles" 
	        ref="roleTable" 
	        showCheck="0" 
	        :option="option"
	        :rowClick="roleTableRowClick" 
	        :cellClick="roleCellClick"
          :rowDblClick="rowDblClick"
	        :columns="columns" >
        </hb-table>  
      </div>
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
  	<el-dialog title="新增角色" size="tiny" v-model="showRoleWin">
	  <el-form :model="curRole">
	    <el-form-item label="角色名称">
	      <el-input v-model="curRole.role_name" ></el-input>
	    </el-form-item>
	    <el-form-item label="角色描述">
	       <el-input type="textarea" v-model="curRole.role_remark"></el-input>
	    </el-form-item>
	  </el-form>
	  <div slot="footer" class="dialog-footer">
	    <el-button @click="showRoleWin = false">取 消</el-button>
	    <el-button type="primary" @click="saveRole">保存</el-button>
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
    	showRoleWin:false,
    	option:{
    		enable:true,
    		tableName:'role'
    	},
      curRole:{
      	id:'',
      	role_name:'',
      	role_remark:''
      },
      columns:[{
        property:"id",
        label:"角色ID",
        width:85
      },{
        property:"role_name",
        label:"角色名称",
        className:'cellClick',
        width:180
      },{
		    property:"role_remark",
          label:"角色描述"
      }],
      treeData:[],
      props: {
        key:'id',
        label: 'name',
        children: 'children'
      },
      checkStrictly:true
    }
  },
  methods: {
      roleTableRowClick:function(curRow,oldRow){
        this.curRole = curRow;
        this.loadRoleModules();
      },
      roleCellClick:function(row, column, cell, event){
      	event.stopPropagation();
      	if(column.property !== 'role_name'){
      		return;
      	}
      	this.curRole = row;
      	this.showRoleWin=true;
      },
      rowDblClick:function(row,event){
        this.curRole = row;
        this.showRoleWin=true;
      },
      saveModule:function(){
        var me =this;
        if(!me.curRole){
        	me.$message("请选择一个角色");
        	return;
        }
        var selectModules = me.$refs.menuTree.getCheckedKeys(false);
        request.post('role/saveRoleModules',{
        	roleId:me.curRole.id,
        	moduleIds:JSON.stringify(selectModules)
        }).then(function(res){
	         if(res.data.success){
	         	me.$message({message:"保存授权成功",type:'success'});
	         }
	    });
      },
      saveRole:function(){
      	var me =this;
      	request.post('role/saveRole',this.curRole).then(function(res){
	         if(res.data.success){
	         	me.$message({message:"保存成功",type:'success'});
	         	me.showRoleWin = false;
	         	me.$refs.roleTable.loadData();
	         }
	      });
      },
      showAddRole:function(){
      	this.showRoleWin = true;
      	this.reset();
      },
      reset:function(){
      	this.curRole = {id:'',role_name:'',role_remark:''}
      },
      loadRoleModules:function(){
        var me =this;
        request.get('role/getModulesByRoleId',{roleId:me.curRole.id}).then(function(res){
          	me.$refs.menuTree.setCheckedKeys(res.data,false);
        });
      }
  }
}
</script>

<style lang="css" scoped>
.user-table{width: 750px;}
.buttons{
  padding: 12px;
}
.tree-con{
  width:600px;
  padding:0 20px 30px 0px;
}
.tree-title{
  padding:10px;
  background-color: #eee;
}
</style>
