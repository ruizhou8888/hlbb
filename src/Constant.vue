<template>
	<div class="hbox flex1">
		<div class="flex1 vbox nowidth">
			<div class="buttons">
				<el-button icon="plus" @click="showConstantType">新增常量类型</el-button>
			</div>
			<hb-table
				url="constant/getConstantTypes" 
	          	ref="constantTypeTable" 
	          	showCheck="0" 
	          	showPage="1"  
	          	:option="option"
	          	:columns="constantTypeColumns"
	          	:rowClick="typeRowClick"
	          	:rowDblClick="typeDblClick"
			></hb-table>
		</div>
		<div class="spaceing"></div>
		<div class="flex1 vbox nowidth">
			<div class="buttons">
				<el-button icon="plus" @click="addConstant">新增常量值</el-button>
			</div>
			<hb-table
				url="constant/getConstants" 
	          	ref="constantTable" 
	          	:option="constantOption"
	          	showCheck="0" 
	          	showPage="1"  
	          	:columns="constantColumns"
	          	:params.sync="params"
	          	:rowDblClick="constantDblClick"
			></hb-table>
		</div>
		<el-dialog title="新增常量类型" size="tiny" v-model="showTypeWin">
	  	  <el-form :model="curType">
	  	    <el-form-item label="类型编码">
	  	      <el-input v-model="curType.type_no" :readonly="typeReadOnly" ></el-input>
	  	    </el-form-item>
	  	    <el-form-item label="常量类型">
	  	       <el-input type="textarea" v-model="curType.content"></el-input>
	  	    </el-form-item>
	  	  </el-form>
	  	  <div slot="footer" class="dialog-footer">
	  	    <el-button @click="showTypeWin = false">取 消</el-button>
	  	    <el-button type="primary" @click="saveType">保存</el-button>
	  	  </div>
	  	</el-dialog>
	  	<el-dialog title="新增常量值" size="tiny" v-model="showConstant">
	  	  <el-form :model="curConstant">
	  	    <el-form-item label="所属常量类型">
	  	      <el-input v-model="curConstant.typeName" readonly ></el-input>
	  	    </el-form-item>
	  	    <el-form-item label="常量值">
	  	       <el-input type="textarea" v-model="curConstant.content"></el-input>
	  	    </el-form-item>
	  	  </el-form>
	  	  <div slot="footer" class="dialog-footer">
	  	    <el-button @click="showConstant = false">取 消</el-button>
	  	    <el-button type="primary" @click="saveConstant">保存</el-button>
	  	  </div>
	  	</el-dialog>
	</div>
</template>
<script>
    import request from './request.js'
    import HbTable from './component/HbTable.vue'

    export default {
        components: {
            HbTable
        },
        data() {
            return {
                showTypeWin: false,
                showConstant: false,
                typeReadOnly: false,
                curType: {},
                curConstant: {},
                params: {
                    typeNo: ''
                },
                option: {
                    enable: true,
                    tableName: 'constant_type'
                },
                constantOption: {
                    enable: true,
                    tableName: 'constant'
                },
                constantTypeColumns: [{
                    property: "type_no",
                    label: "常量编码"
                }, {
                    property: "content",
                    label: "常量类型"
                }, ],
                constantColumns: [{
                    property: "id",
                    label: "常量值"
                }, {
                    property: "content",
                    label: "常量名称"
                }, ]
            }
        },
        methods: {
            typeRowClick: function(row) {
                this.curType = row;
                this.curConstant.type_no = this.curType.type_no;
                this.curConstant.typeName = this.curType.content;
                this.params.typeNo = this.curType.type_no;
                this.$refs.constantTable.loadData();
            },
            showConstantType: function() {
                this.curType = {};
                this.showTypeWin = true;
                this.typeReadOnly = false;
            },
            typeDblClick: function(row) {
                this.curType = row;
                this.showTypeWin = true;
                this.typeReadOnly = true;
            },
            constantDblClick: function(row) {
                this.showConstant = true;
                this.curConstant.content = row.content;
            },
            addConstant: function() {
                if (!this.curType.id) {
                    this.$message('请先选择一个常量类型');
                    return;
                }
                this.showConstant = true;
                this.curConstant.content = "";
            },
            saveType: function() {
                var me = this;
                request.post('constant/saveConstantType', {
                    id: this.curType.id,
                    content: this.curType.content,
                    type_no: this.curType.type_no
                }).then(function(res) {
                    if (res.data.success) {
                        me.showTypeWin = false;
                        me.$refs.constantTypeTable.loadData();
                    }
                })
            },
            saveConstant: function() {
                var me = this;
                request.post('constant/saveConstant', me.curConstant).then(function(res) {
                    if (res.data.success) {
                        me.showConstant = false;
                        me.$refs.constantTable.loadData();
                    }
                })
            }
        }
    }
</script>
<style lang="css">
    .buttons {
        padding: 12px;
    }
</style>