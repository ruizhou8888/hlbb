<template>
<div class="vbox flex1">
	<div class="search-con">
		<el-form ref="form" :inline="true" :model="search" label-width="80px">
            <el-form-item label="姓名">
                <el-input v-model="search.name" placeholder="姓名搜索"></el-input>
            </el-form-item>
            <el-form-item label="学校" style="margin-right:35px">
		    	<el-select
				    v-model="search.school_id"
				    filterable
				    clearable
				    remote
				    placeholder="搜索学校"
				    :remote-method="searchSchool"
				    :loading="loadSchool">
				    <el-option
				      v-for="s in schools"
				      :key="s.id"
				      :label="s.school_name"
				      :value="s.id">
				    </el-option>
			  	</el-select>
		    </el-form-item>	
		    <el-form-item label="院系">
		    	<el-select  clearable v-model="search.dept_id" placeholder="请选择">
				    <el-option
				      v-for="d in depts"
				      :label="d.dept_name"
				      :value="d.id">
				    </el-option>
			  	</el-select>
	    	</el-form-item>
	    	<el-form-item label="专业">
		    	<el-select clearable v-model="search.major_id" placeholder="请选择">
				    <el-option
				      v-for="m in majors"
				      :label="m.major_name"
				      :value="m.id">
				    </el-option>
			  	</el-select>
		    </el-form-item>
		    
		  	<hb-select
		  		class="inlineblock"
				label="CET"
				typeNo="cet"
				v-on:change="change"
				:val="search.cet"
		    />	
		  	<el-form-item label="性别">
			  	<el-select v-model="search.sex" clearable placeholder="请选择">
				    <el-option
				      v-for="item in sexs"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
			  	</el-select>
		  	</el-form-item>
		    <hb-select
		  		class="inlineblock"
				label="船型"
				typeNo="ship_type"
				v-on:change="change"
				:val="search.ship_type"
		    />
		    <hb-select
		  		class="inlineblock"
				label="航线"
				typeNo="ship_route"
				v-on:change="change"
				:val="search.ship_route"
		    />
		    <el-form-item label="独生子女">
			  	<el-select v-model="search.only_child" clearable placeholder="请选择">
				    <el-option
				      v-for="item in onlyChilds"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
			  	</el-select>
		  	</el-form-item>
		    <el-form-item>
			    <el-button type="primary" @click="searchCrew">搜索</el-button>
			    <el-button @click="reset">重置</el-button>
		  	</el-form-item>
		 </el-form>
	</div>
	<div class="search-result">
		<span class="tag">搜索结果：</span>
		<span>总共 <b class="num">13</b>人</span>
		<span>，</span>
		<span>关注本公司 <b class="num">1</b>人</span>
	</div>
	<div class="vbox flex1">
		<hb-table url="crew/searchCrews" 
	        ref="crewTable" 
	        showCheck="0"
	        :params="search"
	        :cellClick="roleCellClick"
	        :columns="columns" >
        </hb-table>
	</div>
    <el-dialog title="基本详情" top="5%" v-model="showDetail" size="small">
	  	<crew-detail :crewId="curCrewId" ></crew-detail>	
	</el-dialog>
    <el-dialog title="操作提示" v-model="payDialog" size="tiny">
        <span>查看简历需支付<b v-text="need_pay_money"></b>元，公司账户余额：<b v-text="balance"></b>元</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="payDialog = false">取 消</el-button>
            <el-button type="primary" @click="pay">确 认</el-button>
        </span>
    </el-dialog>
</div>
</template>
<script>
    import request from './request.js'
    import cookie from './util/cookie.js'
    import HbSelect from './component/HbSelect.vue'
    import HbTable from './component/HbTable.vue'
    import CrewDetail from './component/CrewDetail.vue'

    export default {
        components: {
            HbSelect,
            HbTable,
            CrewDetail
        },
        data() {
            return {
                search: {
                    name: '',
                    school_id: '',
                    dept_id: '',
                    major_id: '',
                    cet: '',
                    sex: '',
                    only_child: '',
                    ship_type: '',
                    ship_route: ''
                },
                curCrewId: '',
                showDetail: false,
                payDialog: false,

                need_pay_money: 0,
                insufficient: false, //余额不足
                balance: 0,

                loadSchool: false,
                majors: [],
                schools: [],
                depts: [],
                columns: [{
                    property: "crew_name",
                    label: "姓名",
                    className: 'cellClick',
                    width: 115
                }, {
                    property: "sex_name",
                    label: "性别"
                }, {
                    property: "birthday",
                    label: "出生年月"
                }, {
                    property: "school_name",
                    label: "所属学校"
                }, {
                    property: "read_state",
                    label: "是否已查看简历",
                    width: 180
                }],
                sexs: [{
                    value: 1,
                    label: '男'
                }, {
                    value: 2,
                    label: '女'
                }],
                onlyChilds: [{
                    value: 1,
                    label: '是'
                }, {
                    value: 2,
                    label: '不是'
                }]
            }
        },
        watch: {
            'search.school_id': function() {
                this.loadDepts();
                this.searchCrew();
            },
            'search.dept_id': function() {
                this.loadMajors();
                this.searchCrew();
            },
            'search.school_id': function() {
                this.searchCrew();
            },
            'search.cet': function() {
                this.searchCrew();
            },
            'search.sex': function() {
                this.searchCrew();
            },
            'search.only_child': function() {
                this.searchCrew();
            },
            'search.name': function() {
                this.searchCrew();
            },
            'search.ship_type': function() {
                this.searchCrew();
            },
            'search.ship_route': function() {
                this.searchCrew();
            }
        },
        methods: {
            change: function(v) {
                this.search[v.typeNo] = v.val;
            },
            searchSchool: function(query) {
                var me = this;
                if (!query) {
                    return;
                }
                me.loadSchool = true;
                request.get('school/getSchoolForSelect', {
                    query: query
                }).then(function(res) {
                    me.schools = res.data;
                    me.loadSchool = false;
                });
            },
            roleCellClick: function(row, column, cell, event) {
                var me = this;
                event.stopPropagation();
                if (column.property !== 'crew_name') {
                    return;
                }

                if (row.read_count == 0) {
                    request.get('company/getReadIsNeedPay', {
                        companyId: cookie.getCookie('company-id').trim()
                    }).then(function(res) {
                        if (res.data.is_need == 1) {
                            me.need_pay_money = res.data.need_pay_money;
                            me.balance = res.data.balance;
                            me.insufficient = res.data.insufficient;
                            me.payDialog = true;
                            return;
                        }
                        me.showDetail = true;
                        me.curCrewId = row.id;
                    });
                } else {
                    me.showDetail = true;
                    me.curCrewId = row.id;
                }
            },
            loadDepts: function() {
                var me = this;
                request.get('school/getDeptBySchoolId', {
                    schoolId: this.search.school_id
                }).then(function(res) {
                    me.depts = res.data;
                });
            },
            loadMajors: function() {
                var me = this;
                request.get('school/getMajorByDeptId', {
                    deptId: this.search.dept_id
                }).then(function(res) {
                    me.majors = res.data;
                });
            },
            searchCrew: function() {
                this.$refs.crewTable.loadData();
            },
            reset: function() {
                this.search = {
                    school_id: '',
                    dept_id: '',
                    major_id: '',
                    cet: '',
                    sex: '',
                    only_child: '',
                    ship_type: '',
                    ship_route: ''
                }
            },
            pay: function() {
                if (this.insufficient) {
                    this.$message({
                        showClose: true,
                        message: '账户余额不足，请先充值',
                        type: 'warning'
                    });
                    return;
                }
            }
        }
    }
</script>
<style scope>
    .search-con {
        padding-top: 15px;
    }
    
    .inlineblock {
        display: inline-block;
    }
    
    .search-result {
        padding: 12px 0 15px 40px;
        font-size: 16px;
        border-top: 2px solid #eeeeee;
        border-bottom: 2px solid #eeeeee;
        background-color: #EEEEF4;
    }
    
    .num {
        color: #20a0ff;
    }
</style>