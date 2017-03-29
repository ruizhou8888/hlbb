<template>
<div class="hbox flex1">
	<div style="width:200px" class="vbox">
		<el-tree class="flex1" :data="data" :default-expand-all="defaultExpand" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
	</div>
	<div class="vbox flex1">
		<hb-table url="resume/companyGetReviceResume" 
	        ref="resumeTable" 
	        showCheck="0"
	        :params="params"
	        :cellClick="roleCellClick"
	        :columns="columns" >
        </hb-table> 
	</div>
	<el-dialog title="基本详情" top="5%" v-model="showDetail" size="small">
	  	<crew-detail :crewId="curCrewId" :state="state" :sendId="sendId"></crew-detail>	
	</el-dialog>
</div>
</template>
<script>
import HbTable from './component/HbTable.vue'
import CrewDetail from './component/CrewDetail.vue'
import request from './request.js'
import cookie from './util/cookie.js'

export default {
	components:{
	    HbTable,
	    CrewDetail
  	},
    data() {
      return {
      	defaultExpand:true,
      	showDetail:false,
      	loading:true,
      	curCrewId:'',
      	state:'',
      	sendId:'',

      	params:{
      		companyId:cookie.getCookie('company-id').trim(),
			state:''
      	},
      	columns:[{
	        property:"crew_name",
	        label:"姓名",
	        className:'cellClick',
	        width:115
      	},{
	        property:"job_name",
	        label:"应聘职位",
	        width:180
      	},{
		    property:"state_name",
	        label:"状态"
      	},{
		    property:"sex_name",
	        label:"性别"
      	},{
      		property:"birthday",
	        label:"出生年月"
      	},{
      		property:"school_name",
	        label:"所属学校"
      	}],
      	data: [{
          label: '状态',
          children: [
          	{label: '投递成功',state:0},
          	{label: '等待面试',state:1},
          	{label: '不合适',state:2},
          	{label: '待定',state:3},
          	{label: '面试通过',state:4}
          ]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      };
    },
    methods: {
      handleNodeClick(data) {
		this.params.state = data.state;
        this.$refs.resumeTable.loadData();
      },
      roleCellClick:function(row, column, cell, event){
      	event.stopPropagation();
      	if(column.property !== 'crew_name'){
      		return;
      	}
      	this.showDetail = true;
      	this.curCrewId = row.crew_id;
      	this.sendId = row.send_resume_id;
      	this.state = row.state;
      },
    }
};
</script>
<style scope>
	.el-dialog--large{
		width:73%;
	}
	.el-input.is-disabled .el-input__inner {
	    background-color: #fff;
	    border:none;
	    color: #000000;
	    font-weight: bold;
	    cursor: normal;
	}
	.image{
		width: 150px;
	}
</style>