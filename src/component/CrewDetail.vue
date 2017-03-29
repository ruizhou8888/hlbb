<template>
<div>
	<el-form v-loading.body="loading" ref="crewForm" :model="crew" label-width="80px">
	  		<div class="hbox flex1">
	  			<div class="flex1">
	  				<el-row>
					  	<el-col :span="11">
					  		<el-form-item label="姓名">
							  	<el-input v-model="crew.name" :disabled="true"></el-input>
						  	</el-form-item>
					  	</el-col>
					  	<el-col class="line" :span="2"></el-col>
					  	<el-col :span="11">
						  	<el-form-item label="学校">
						    	<el-input v-model="crew.school_name" :disabled="true" ></el-input>
					  		</el-form-item>
					  	</el-col>
					</el-row>
					<el-row>
					  	<el-col :span="11">
					  		<el-form-item label="CET">
							  	<el-input v-model="crew.cet_name" :disabled="true"></el-input>
						  	</el-form-item>
					  	</el-col>
					  	<el-col class="line" :span="2"></el-col>
					  	<el-col :span="11">
						  	<el-form-item label="院系">
						    	<el-input v-model="crew.dept_name" :disabled="true" ></el-input>
					  		</el-form-item>
					  	</el-col>
					</el-row>
					<el-row>
					  	<el-col :span="11">
					  		<el-form-item label="口语能力">
							  	<el-input v-model="crew.speech_level_name" :disabled="true"></el-input>
						  	</el-form-item>
					  	</el-col>
					  	<el-col class="line" :span="2"></el-col>
					  	<el-col :span="11">
						  	<el-form-item label="专业">
						    	<el-input v-model="crew.major_name" :disabled="true" ></el-input>
					  		</el-form-item>
					  	</el-col>
					</el-row>
					<el-row>
					  	<el-col :span="11">
					  		<el-form-item label="籍贯">
							  	<el-input v-model="crew.place" :disabled="true"></el-input>
						  	</el-form-item>
					  	</el-col>
					  	<el-col class="line" :span="2"></el-col>
					  	<el-col :span="11">
					  		<el-form-item label="政治面貌">
							  	<el-input v-model="crew.politics_name" :disabled="true"></el-input>
						  	</el-form-item>
					  	</el-col>
					</el-row>
					<el-row>
					  	<el-col :span="11">
					  		<el-form-item label="出生年月">
							  	<el-input v-model="crew.birthday" :disabled="true"></el-input>
						  	</el-form-item>
					  	</el-col>
					  	<el-col class="line" :span="2"></el-col>
					  	<el-col :span="11">
						  	<el-form-item label="独生子女">
							  	<el-input v-model="crew.only_child_name" :disabled="true"></el-input>
						  	</el-form-item>
					  	</el-col>
					</el-row>
	  			</div>
	  			<div class="image">
					<div>
						<img src="https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=1003916089,3639991483&fm=58" alt="">
					</div>
					<div style="font-size:13px;padding-top:10px;">
						<span>身高 </span>
						<span style="font-weight:bold;" v-text="crew.height"></span>
						<span>&nbsp;&nbsp;</span>
						<span>体重 </span>
						<span style="font-weight:bold;" v-text="crew.weight"></span>
					</div>
	  			</div>
	  		</div>
			<el-tabs type="border-card">
			  	<el-tab-pane label="求职意向">
					<el-col :span="11">
				  		<el-form-item label="公司性质">
						  	<el-input v-model="intent.nature_name" :disabled="true"></el-input>
					  	</el-form-item>
				  	</el-col>
				  	<el-col class="line" :span="2"></el-col>
				  	<el-col :span="11">
					  	<el-form-item label="服务年限">
					    	<el-input v-model="intent.term_name" :disabled="true" ></el-input>
				  		</el-form-item>
					  	<!-- <el-form-item label="公司地域">
					    	<el-input v-model="crew.school" :disabled="true" ></el-input>
				  		</el-form-item> -->
				  	</el-col>
				  	<el-col :span="11">
					  	<el-form-item label="意向岗位">
					    	<el-input v-model="intent.intent_post_name" :disabled="true" ></el-input>
				  		</el-form-item>
				  	</el-col>
				  	<el-col class="line" :span="2"></el-col>
				  	<el-col :span="11">
				  		<el-form-item label="船东来源">
						  	<el-input v-model="intent.dd" :disabled="true"></el-input>
					  	</el-form-item>
				  	</el-col>
				  	<el-col :span="11">
				  		<el-form-item label="船型">
						  	<el-input v-model="intent.ship_type_name" :disabled="true"></el-input>
					  	</el-form-item>
				  	</el-col>
				  	<el-col class="line" :span="2"></el-col>
				  	<el-col :span="11">
					  	<el-form-item label="航线">
					    	<el-input v-model="intent.route_name" :disabled="true" ></el-input>
				  		</el-form-item>
				  	</el-col>
			  	</el-tab-pane>
			  	<el-tab-pane label="证书信息">
			  		<div class="hbox" style="height:250px;width:100%">
						<hb-table url="resume/getCrewCertificate" 
					        ref="certificateTable" 
					        showCheck="0"
					        showPage="0"
					        :params="params"
					        :columns="certificateColumns" >
				        </hb-table>
			  		</div>
			  	</el-tab-pane>
			  	<el-tab-pane label="任解职记录">
			  		<div class="hbox" style="height:270px;width:100%">
						<hb-table url="resume/getCrewWork" 
					        ref="workTable" 
					        showCheck="0"
					        showPage="0"
					        :params="params"
					        :columns="workColumns" >
				        </hb-table>
			  		</div>
			  	</el-tab-pane>
			</el-tabs>
		</el-form>
	  <div style="padding:15px 0 20px 0;text-align:center">
	  	<div style="float:left" v-cloak>
	    	<el-button type="info" icon="star-on" @click="updateRelation(1)" v-text="loveBtn[relation.flag]"></el-button>
	    	<el-button type="danger" icon="circle-close" @click="updateRelation(2)" v-text="blackBtn[relation.flag]"></el-button>
	  	</div>
	  	<div v-if="selfState || selfState==0" style="float:right">
		    <el-button v-if="selfState==0 || selfState == 3" type="primary" icon="circle-close" @click="inviteInterview(2)" >不符合公司要求</el-button>
		    <el-button v-if="selfState==0" type="primary" icon="message" @click="showInvitePanel = true">发送视频面试邀请</el-button>
		    <el-button v-if="selfState==1" type="primary" :disabled="true">已发送面试邀请</el-button>
		    <el-button v-if="selfState==2" type="primary" :disabled="true">已标记为不符合公司要求</el-button>
		    <el-button v-if="selfState==1" type="text" icon="date" @click="loadInviteRecord">查看邀请详情</el-button>
	  	</div>
	  </div>
	  	<el-dialog title="视频面试信息" :modal="false" size="large" v-model="showInvitePanel">
		  <el-form :model="invite">
		    <el-form-item label="面试时间">
			    <el-date-picker
			      v-model="invite.datetime"
			      type="datetime"
			      format="yyyy-MM-dd HH:mm"
			      :picker-options="pickerOptions"
			      placeholder="选择面试时间">
			    </el-date-picker>
		    </el-form-item>
		    <el-form-item label="面试信息">
			    <el-input type="textarea" autosize v-model="desc"></el-input>
		  	</el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="showInvitePanel = false">取 消</el-button>
		    <el-button type="primary" :loading="sending" @click="inviteInterview(1)">{{!sending ? '发送邀请' : '正在发送'}}</el-button>
		  </div>
		</el-dialog>
</div>
</template>
<script>
import HbTable from './HbTable.vue'
import request from '../request.js'
import date from '../util/date.js'
import cookie from '../util/cookie.js'

export default{
	components:{
		HbTable
	},
	props:{
		crewId:[String,Number],
		sendId:'',
		state:''
	},
	mounted(){
		var me =this;
		me.loadCrew();
	},
	watch:{
		'crewId':function(){
			this.params.crewId = this.crewId;
			this.loadCrew();
			this.$refs.workTable.loadData();
			this.$refs.certificateTable.loadData();
		},
		'state':function(){
			console.log(this.state);
			this.selfState = this.state;
		}
	},
	computed:{
		desc:function(){
			var d = new Date(this.invite.datetime);
			return this.crew.name+'，您好！我们已收到您的简历并通过初选。现通知您参加视频面试，时间为：'+d.pattern('yyyy-MM-dd HH:mm:ss')+'，届时请打开【海里巴巴】APP等待视频邀请。'
		}
	},
	data(){
		return {
			params:{
	      		crewId:this.crewId,
	      	},
	      	selfState:this.state,
	      	crew:{},
	      	intent:{},
	      	relation:{},
	      	loading:false,
	      	sending:false,
	      	showInvitePanel:false,
	      	invite:{
	      		datetime:new Date()
	      	},
	      	loveBtn:{
	      		'-1':'收藏',
	      		'0':'收藏',
	      		'1':'取消收藏'
	      	},
	      	blackBtn:{
	      		'-1':'拉黑',
	      		'1':'拉黑',
	      		'0':'取消拉黑'
	      	},
	      	pickerOptions: {
	          disabledDate(time) {
	            return time.getTime() <= Date.now() - 8.64e7;
	          }
	        },

	      	certificateColumns:[
	      		{property:"certificate",label:"证书名称",width:150},
	      		{property:"certificate_no",label:"证书号码",width:250},
	      		{property:"publish_date",label:"签发日期",width:150},
	      		{property:"end_date",label:"截止日期",width:150},
	      		{property:"publish_unit",label:"签发机构",width:150},
	      		{property:"publish_person",label:"签发人",width:150},
	      		{property:"certificate_print_no",label:"证书印刷号",width:200},
	      		{property:"type_level",label:"类别等级职务",width:300},
	      		{property:"del_date",label:"注销日期"}
	      	],
	      	workColumns:[
	      		{property:"certificate_no",label:"适任证号",width:200},
	      		{property:"post",label:"任职职务",width:150},
	      		{property:"start_time",label:"任职日期",width:150},
	      		{property:"place",label:"任职地点",width:200},
	      		{property:"end_time",label:"解职时间",width:150},
	      		{property:"displace",label:"解职地点",width:200},
	      		{property:"office_day",label:"任职天数",width:200},
	      		{property:"ship_name",label:"船名",width:300},
	      		{property:"ship_type",label:"船舶种类",width:200},
	      		{property:"ship_level",label:"船舶等级",width:200},
	      		{property:"navigation_area",label:"航区",width:100},
	      	]
		}
	},
	methods:{
		loadCrew:function(){
	      	var me =this;
	      	me.loading = true;
	      	request.get('resume/getCrewDetail',{
	      		crewId:this.crewId,
	      		companyId:cookie.getCookie('company-id').trim()
	      	}).then(function(res){
		        me.crew =  res.data.crew;
		        if(res.data.intent){
		        	me.intent =  res.data.intent;
		        }else{
		        	me.intent = {};
		        }
		        if(res.data.relation){
		        	me.relation = res.data.relation;
		        }else{
		        	me.relation = {flag:-1};
		        }
		        me.loading = false;
		    });	
      	},
      	loadInviteRecord:function(){
	      	var me =this;
	      	request.get('resume/getInviteRecord',{
	      		crewId:this.crewId,
	      		companyId:cookie.getCookie('company-id').trim()
	      	}).then(function(res){
		        me.invite.datetime =  res.data.record.interview_time;
		        me.desc =  res.data.record.remark;
		        me.showInvitePanel = true;
		    });	
      	},
      	inviteInterview:function(state){
      		var me =this;
      		if(state == 1){
      			me.sending = true;
      		}
      		request.post('resume/updateSendResumeState',{
	          sendId:me.sendId,
	          crewId:me.crewId,
	          state:state,
	          interview_time:new Date(me.invite.datetime).pattern('yyyy-MM-dd HH:mm:ss'),
	          desc:me.desc,
	          uid:cookie.getCookie('user-id').trim()
	        }).then(function(res){
	          if(res.data.success){
	            me.updateLocalState(state);
	            me.sending = false;
	          }
	        });
      	},
      	updateLocalState:function(state){
      		var me =this;
      		me.selfState = state;
      		me.showInvitePanel = false;
      	},
      	updateRelation:function(type){
      		var me=this;
      		var flag ; 
      		if(type==1){
      			flag = me.relation.flag == 1 ? -1 : 1;
      		}else if(type==2){
      			flag = me.relation.flag == 0 ? -1 : 0;
      		}
      		request.post('resume/updateRelation',{
	          companyId:cookie.getCookie('company-id').trim(),
	          crewId:me.crewId,
	          flag:flag
	        }).then(function(res){
	          if(res.data.success){
	            me.relation.flag = flag;
	            me.$message({
		          message: '操作成功',
		          type: 'success'
		        });
	            me.$emit('updateRelation');
	          }
	        });
      	}
	}
}	
</script>
<style scope>
	.el-dialog--large{
		width:73%;
		border:3px solid rgba(52,52,52,0.3);
	}
</style>