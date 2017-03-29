<template>
	<div class="vbox flex1">
		<hb-table url="company/getRelations" 
	        ref="crewTable" 
	        showCheck="0"
	        :params="params"
	        :cellClick="roleCellClick"
	        :columns="columns" >
        </hb-table> 
        <el-dialog title="基本详情" top="5%" v-model="showDetail" size="small">
		  	<crew-detail :crewId="curCrewId" v-on:updateRelation="refreshRelation"></crew-detail>	
		</el-dialog>
	</div>
</template>
<script>
    import cookie from './util/cookie.js'
    import CrewDetail from './component/CrewDetail.vue'
    import HbTable from './component/HbTable.vue'

    export default {
        components: {
            HbTable,
            CrewDetail
        },
        data() {
            return {
                params: {
                    companyId: cookie.getCookie('company-id').trim(),
                    flag: 0
                },
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
                    property: "dept_name",
                    label: "院系"
                }, {
                    property: "major_name",
                    label: "所学专业"
                }],
                showDetail: false,
                curCrewId: ''
            }
        },
        methods: {
            roleCellClick: function(row, column, cell, event) {
                event.stopPropagation();
                if (column.property !== 'crew_name') {
                    return;
                }
                this.showDetail = true;
                this.curCrewId = row.crew_id;
            },
            refreshRelation: function() {
                this.$refs.crewTable.loadData();
            }
        }
    }
</script>
<style>

</style>