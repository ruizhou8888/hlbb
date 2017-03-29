<template>
<div class="hbox flex1">
	<div class="flex1" >
		<div class="optioncon">
			<el-button type="success" icon="message" @click="save">发送</el-button>
			<el-button @click="" >取消</el-button>
		</div>
        <el-form ref="form" label-position="left" style="width: 65%;padding-left:20px;" :model="notice" label-width="80px">
            <el-form-item label="收件人">
                <el-checkbox v-model="checked">发给所有</el-checkbox>
                <el-input :readonly="checked" v-model="choseMngNames" placeholder="输入收件人或选择">
                    <template slot="append">
                         <el-button @click="openChoseUser" icon="plus"></el-button>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item label="主题">
                <el-input v-model="notice.title" placeholder="输入主题"></el-input>
            </el-form-item>
            <div style="margin-bottom:15px">
                <el-upload
                    action="hlbb/common/upload"
                    ref="upload"
                    :auto-upload="false"
                    :data="uploadParam"
                    :on-remove="removeFile">
                    <el-button type="text">添加附件</el-button>
                </el-upload>
            </div>
            <div id="desc" style="height: 500px;"></div>
        </el-form>
    </div>
    <el-dialog v-model="showMng" size="small">
        <div class="vbox" style="height: 500px;">
            <div style="padding: 5px 0">
                <el-input v-model="params.companyName" placeholder="输入关键字查询"></el-input>
            </div>
            <hb-table url="manager/getManagers" 
                class="flex1"
                ref="managerTable" 
                :params="params"
                showCheck="1"
                :columns="columns" >
            </hb-table>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="showMng = false">取 消</el-button>
            <el-button type="primary" @click="sureChose">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>
<script>
import wangEditor from 'wangeditor'
import config from './config.js'
import cookie from './util/cookie.js'
import request from './request.js'
import HbTable from './component/HbTable.vue'

export default {
    components:{
        HbTable
    },
    mounted: function() {
        var me = this;
        me.editor = new wangEditor('desc');
        me.editor.config.menus = config.menus;
        me.editor.create();
    },
    watch:{
        'params.companyName':function(){
            this.$refs.managerTable.loadData();
        }
    },
    data() {
        return {
            showMng:false,
            uploadParam: {
                type: 'notice',
                tableName: 'notice',
                primaryValue:'',
                uid: cookie.getCookie('user-id')
            },
            fileIds:[],//上传完成后返回的uploadFile _ID
            notice: {
                title:'',
                content:''
            },
            choseMngIds:[],
            choseMngObj:[],
            checked:false,
            params:{
                companyName:''
            },
            columns:[{
                property:"id",
                label:"用户ID",
                width:85
            },{
                property:"login_name",
                label:"账户名"
            },{
                property:"company_name",
                label:"所属公司"
            }]
        }
    },
    computed:{
        choseMngNames:function(){
            var str="";
            for(var i=0;i<this.choseMngObj.length;i++){
                str+=this.choseMngObj[i].login_name+';'
            }
            return str;
        }
    },
    methods:{
        removeFile:function(file){
            if(!file.id){
                return;
            }
            request.post('common/delUploadFile', {
                id: file.id
            }).then(function(res) {
                if (res.data.success) {
                    me.$message({
                        message: "删除成功",
                        type: 'success'
                    });
                }
            });
        },
        openChoseUser:function(){
            if(this.checked){
                return;
            }
            this.showMng = true;
        },
        sureChose:function(){
            var me=this;
            me.choseMngIds =me.$refs.managerTable.getCheckedRows(true);
            me.choseMngObj =me.$refs.managerTable.getCheckedRows(false);
            me.showMng = false;
        },
        save:function(){
            var me=this;
            me.notice.content = me.editor.$txt.html();
            var to_who = 0;
            if(!me.checked){
                to_who = 1;
                if(me.choseMngIds.length==0){
                    me.$message({
                        message: "请选择收件人",
                        type: 'warning'
                    });
                    return;
                }
            }
            request.post('notice/addNotice',{
                choseMngNames:me.choseMngNames,
                title:me.notice.title,
                content:me.notice.content,
                to_who:to_who,
                choseMng:JSON.stringify(me.choseMngIds)
            }).then(function(res) {
                if (res.data.success) {
                    me.uploadParam.primaryValue = res.data.noticeId;
                    me.$refs.upload.submit();
                    me.$message({
                        message: "保存成功",
                        type: 'success'
                    });
                }
            });
        }
    }
}
</script>