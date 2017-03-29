<template>
	<div>
		<el-form-item :label="label">
			<el-select v-model="value" @change="change" 
				:disabled="disabled == 'true'" 
				:multiple="multiple == 'true'" 
				clearable placeholder="请选择">
			    <el-option
			      v-for="item in options"
			      
			      :label="item[displayField]"
			      :value="item[valueField]"
			      >
			    </el-option>
		  	</el-select>
	  	</el-form-item>
	</div>
</template>
<script>
import request from '../request.js'

export default {
	data () {
		return {
			options:[],
			value:''
		}
	},
	beforeMount:function(){
	    var me =this;
	    me.load();
  	},
	props:{
		displayField:{
			type:String,
			default:'name'
		},
		valueField:{
			type:String,
			default:'value'
		},
		typeNo:{
			type:String
		},
		url:{
			type:String
		},
		val:{},
		label:{
			type:String
		},
		disabled:{
			type:String
		},
		multiple:{
			type:String
		}
	},
	watch:{
		val:function(){
			this.value = this.val;
		}
	},
	methods:{
		load:function(){
			var me=this;
			request.get('constant/getConstantsByType',{typeNo:me.typeNo}).then(function(res){
		        me.options =  res.data.data;
		        me.$nextTick(function(){
		        	if(me.val!=null && me.val!=undefined && me.val!=''){
		        		me.value = me.val;
		        	}
		        });
		    });
		},
		change:function(v){
			this.$emit('change',{val:v,typeNo:this.typeNo});
		}
	}
}
</script>
<style>
	
</style>