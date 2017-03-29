<template>
<div class="vbox flex1">
    <hb-table url="notice/getNotice" 
        ref="noticeTable" 
        showCheck="0"
        :cellClick="viewNotice"
        :columns="columns" >
    </hb-table> 
    <el-dialog title="通知详情" class="notice" v-model="showNotice" size="small">
          <h2 style="text-align:center" v-text="curRow.title"></h2>
          <div class="notice-con" v-html="curRow.content"></div>
          <div v-if="files.length>0" style="padding:10px;">
                <a style="display: block;margin:5px;color:#00AAFF" v-for="(f,index) in files" :href="f.url" v-text="'附件'+(index+1)+'：'+f.fileName"></a>
          </div>
          <span slot="footer" class="dialog-footer">
               <span style="color:#999;font-size: 14px;" v-text="'时间：'+curRow.created_time"></span>
          </span>
    </el-dialog>
</div>
</template>
<script>
    import request from './request.js'
    import cookie from './util/cookie.js'
    import HbTable from './component/HbTable.vue'

    export default {
        components: {
            HbTable
        },
        data() {
            return {
                showNotice: false,
                curRow: {},
                files:[],
                columns: [{
                    property: "created_uid",
                    label: "发送者",
                    width: 120
                }, {
                    property: "title",
                    label: "主题",
                    className: 'cellClick',
                }, {
                    property: "isattment",
                    label: "附件"
                }, {
                    property: "created_time",
                    label: "创建时间"
                }]
            }
        },
        methods: {
            viewNotice: function(row, column, cell, event) {
                event.stopPropagation();
                if (column.property !== 'title') {
                    return;
                }
                this.showNotice = true;
                this.curRow = row;
                this.loadFiles();
            },
            loadFiles:function(){
                var me = this;
                request.get('common/getUploadFiles', {
                    linkId: me.curRow.id,
                    type: 'notice'
                }).then(function(res) {
                    me.files = res.data;
                });
            }
        }
    }
</script>
<style>
    .notice-con {
        padding: 15px;
    }
    
    .notice .el-dialog__body {
        padding: 30px 20px;
        color: #48576a;
        font-size: 14px;
        height: 550px;
        overflow: auto;
    }
</style>