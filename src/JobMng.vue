<template>
<div class="hbox flex1" style="overflow:auto">
	<div style="width:700px;">
		<div class="optioncon">
			<el-button type="primary" icon="check" @click="saveJob">保存</el-button>
			<el-button @click="publishJob" :disabled="!job.id && job.state == 0" v-text="job.state == 0 ? '发布职位' : '取消发布'"></el-button>
			<el-button @click="reset" icon="circle-close">重置</el-button>
		</div>
		<div style="padding-left:20px;">
			<el-form ref="jobForm" :model="job" label-width="80px">
			  	<el-row>
				  <el-col :span="11">
				  	<el-form-item label="职位名称">
					  	<el-select v-model="job.name" placeholder="请选择">
						    <el-option
						      v-for="item in initJobs"
						      :label="item.label"
						      :value="item.value">
						    </el-option>
					  	</el-select>
				  	</el-form-item>
				  </el-col>
				  <el-col class="line" :span="2"></el-col>
				  <el-col :span="11">
				  	<el-form-item label="招聘人数">
				    	<el-input-number v-model="job.num" :min="1" ></el-input-number>
			  		</el-form-item>
				  </el-col>
				</el-row>
			  	<el-row>
				  <el-col :span="11">
				  	<el-form-item label="截止日期">
				  		<el-date-picker :picker-options="dateRange" type="date" placeholder="截止日期" v-model="job.end_date" ></el-date-picker>
				  	</el-form-item>
				  </el-col>
				  <el-col class="line" :span="2"></el-col>
				  <el-col :span="11">
					  	<hb-select
							class="flex1"
							label="合同期限"
							typeNo="term"
							v-on:change="change"
							:val="job.term"
						/>
				  </el-col>
				</el-row>
			  	<el-row>
				  <el-col :span="11">
				  	<hb-select
						class="flex1"
						label="学历"
						typeNo="education"
						v-on:change="change"
						:val="job.education"
					/>
				  </el-col>
				  <el-col class="line" :span="2"></el-col>
				  <el-col :span="11">
				  	<hb-select
						class="flex1"
						label="经验"
						typeNo="experience"
						v-on:change="change"
						:val="job.experience"
					/>
				  </el-col>
				</el-row>
				<el-row>
				  <el-col :span="11">
				  	<hb-select
						class="flex1"
						label="派员方式"
						typeNo="expatriate_mode"
						v-on:change="change"
						multiple="true"
						:val="job.expatriate_mode"
					/>
				  </el-col>
				  <el-col class="line" :span="2"></el-col>
				  <el-col :span="11">
				  	<hb-select
						class="flex1"
						label="船员去向"
						typeNo="whereabouts"
						v-on:change="change"
						:val="job.whereabouts"
					/>
				  </el-col>
				</el-row>
				<el-row>
				  <el-col :span="11">
				  	<hb-select
						class="flex1"
						label="船型"
						multiple="true"
						typeNo="ship_type"
						v-on:change="change"
						:val="job.ship_type"
					/>
				  </el-col>
				  <el-col class="line" :span="2"></el-col>
				  <el-col :span="11">
				  	<hb-select
						class="flex1"
						label="航线"
						multiple="true"
						typeNo="ship_route"
						v-on:change="change"
						:val="job.ship_route"
					/>
				  </el-col>
				</el-row>
                <el-row>
				  <el-col :span="11">
				  	<hb-select
                        class="flex1"
                        label="福利待遇"
                        typeNo="welfare"
                        v-on:change="change"
                        :val="job.welfare"
                        multiple="true"
                    />
				  </el-col>
				  <el-col class="line" :span="2"></el-col>
				  <el-col :span="11">
				  	<hb-select
						class="flex1"
						label="薪资"
						typeNo="salary"
						v-on:change="change"
						:val="job.salary"
					/>
				  </el-col>
				</el-row>
			</el-form>
		</div>
	  	<div style="padding-left:30px">
	  		<div id="desc"></div>
	  	</div>
	</div>
	<div class="vbox flex1">
		<hb-table url="job/getJobs" 
	        ref="jobTable" 
	        showCheck="0"
          	:rowDblClick="rowDblClick"
	        :columns="columns" >
        </hb-table> 
	</div>
</div>
</template>
<script>
    import request from './request.js'
    import HbSelect from './component/HbSelect.vue'
    import HbTable from './component/HbTable.vue'
    import wangEditor from 'wangeditor'
    import config from './config.js'
    import cookie from './util/cookie.js'
    import moment from 'moment'

    export default {
        components: {
            HbSelect,
            HbTable
        },
        data() {
            return {
                job: {
                    updated_uid: cookie.getCookie('user-id'),
                    created_uid: cookie.getCookie('user-id'),
                    id: '',
                    name: '',
                    salary:'',
                    num: 1,
                    end_date: '',
                    term: '',
                    education: '',
                    experience: '',
                    whereabouts: '',
                    expatriate_mode: [],
                    ship_type: [],
                    ship_route: [],
                    welfare: [],
                    expatriate_modes: '',
                    ship_types: '',
                    ship_routes: '',
                    welfares: '',
                    remark: '',
                    company_id: cookie.getCookie('company-id'),
                    state: 0
                },
                initJobs: [{
                    value: '驾驶实习生',
                    label: '驾驶实习生'
                }, {
                    value: '轮机实习生',
                    label: '轮机实习生'
                }, {
                    value: '电气实习生',
                    label: '电气实习生'
                }],
                dateRange: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                columns: [{
                    property: "id",
                    label: "职位ID",
                    width: 85
                }, {
                    property: "name",
                    label: "职位名称",
                    className: 'cellClick',
                    width: 180
                }, {
                    property: "num",
                    label: "招聘人数"
                }, {
                    property: "state",
                    label: "状态",
                    formatter: function(row, column) {
                        if (row.state == 0) {
                            return '未发布';
                        } else {
                            return '已发布';
                        }
                    }
                }, {
                    property: "end_date",
                    label: "截止日期"
                }]
            }
        },
        mounted: function() {
            var me = this;
            me.editor = new wangEditor('desc');
            me.editor.config.menus = config.menus;
            me.editor.create();
        },
        methods: {
            change: function(v) {
                this.job[v.typeNo] = v.val;
                if (this.job.hasOwnProperty(v.typeNo + 's')) {
                    this.job[v.typeNo + 's'] = v.val.toString();
                }
            },
            rowDblClick: function(row, event) {
                var me = this;
                me.job = row;
                me.editor.$txt.html(row.remark);
                if (typeof row.expatriate_mode != 'string') {
                    return;
                }
                var expatriate_mode = row.expatriate_mode.split(',');
                var ship_type = row.ship_type.split(',');
                var ship_route = row.ship_route.split(',');
                var welfare = row.welfare.split(',');

                me.job.expatriate_mode = [];
                me.job.ship_type = [];
                me.job.ship_route = [];
                me.job.welfare = [];

                expatriate_mode[0] && expatriate_mode.forEach(function(data, index, arr) {
                    me.job.expatriate_mode.push(+data);
                });
                ship_type[0] && ship_type.forEach(function(data, index, arr) {
                    me.job.ship_type.push(+data);
                });
                ship_route[0] && ship_route.forEach(function(data, index, arr) {
                    me.job.ship_route.push(+data);
                });
                welfare[0] && welfare.forEach(function(data, index, arr) {
                    me.job.welfare.push(+data);
                });
                me.job.expatriate_modes = me.job.expatriate_mode.toString();
                me.job.ship_types = me.job.ship_type.toString();
                me.job.ship_routes = me.job.ship_route.toString();
                me.job.welfares = me.job.welfare.toString();
            },
            saveJob: function() {
                var me = this;
                me.job.remark = me.editor.$txt.html();
                me.job.end_date = moment(me.job.end_date).format('YYYY-MM-DD');
                request.post('job/saveJob', me.job).then(function(res) {
                    if (res.data.success) {
                        me.job.id = res.data.id;
                        me.$message({
                            message: "保存成功",
                            type: 'success'
                        });
                        me.$refs.jobTable.loadData();
                    }
                });
            },
            publishJob: function() {
                var me = this;
                request.post('job/publishJob', {
                    id: me.job.id,
                    state: me.job.state
                }).then(function(res) {
                    if (res.data.success) {
                        me.$message({
                            message: "操作成功",
                            type: 'success'
                        });
                        me.job.state = me.job.state == 1 ? 0 : 1;
                        me.$refs.jobTable.loadData();
                    }
                });
            },
            reset: function() {
                Object.assign(this.$data, this.$options.data());
                this.editor.$txt.html('<p><br></p>');
            }
        }
    }
</script>
<style scope>
    .optioncon {
        padding: 15px 30px;
        background: #eee;
        margin-bottom: 20px;
    }
    
    #desc {
        height: 400px;
    }
</style>