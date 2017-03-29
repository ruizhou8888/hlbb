<template>
    <div class="hbox flex1" style="padding:20px 0 0 20px;overflow:auto;">
        <div class="vbox wall" style="width:730px;">
            <el-form ref="form" :model="wall" label-width="90px">
                <div v-if="wall.status_note" v-text="'审核不通过原因：'+wall.status_note" style="color:red;padding:0 0 15px 20px;"></div>
                <el-form-item label="展示标题">
                    <el-input v-model="wall.title" placeholder="请输入展示标题"></el-input>
                </el-form-item>
                <el-form-item label="上传题图">
                    <el-upload
                        ref="upload"
                        class="avatar-uploader"
                        action="hlbb/common/upload"
                        :show-file-list="false"
                        :data="uploadParam"
                        :on-success="uploadSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="wall.file_path" :src="'hlbb/'+wall.file_path" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1M</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="一句话描述">
                    <el-input v-model="wall.subtitle"  placeholder="可选"></el-input>
                </el-form-item>
                <el-form-item label="内容详情">
                    <div id="desc"></div>
                </el-form-item>
                <el-form-item>
                    <el-button v-if="!isReview" :disabled="wall.status == 1 || wall.status == 2" type="primary" @click="onSubmit">保存信息</el-button>
                    <el-button v-if="!isReview" :disabled="!wall.id || wall.status == 1 || wall.status == 2" @click="submitReview">提交供审核</el-button>
                    <el-button v-if="isReview" type="primary" @click="changeWallStatus(2)">审核通过</el-button>
                    <el-button v-if="isReview" @click="changeWallStatus(3)">审核不通过</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div style="margin-left:20px;">
            <div class="phone-con">
                <div class="card-con">
                    <p class="s-remark">所见所得（App列表页面预览）</p>
                    <div class="card">
                        <div class="title" v-text="wall.title"></div>
                        <div class="time" v-text="wall.created_time"></div>
                        <div class="img" v-if="wall.file_path">
                            <img :src="'hlbb/'+wall.file_path" alt="">
                        </div>
                        <div class="subtitle" v-text="wall.subtitle"></div>
                        <div class="readline">
                            阅读全文<i class="el-icon-arrow-right zhishi"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div style="margin-left:10px;">
            <div class="phone-con">
                <div class="card-con detail">
                    <div class="title" v-text="wall.title"></div>
                    <div class="info">
                        <el-tag type="primary">原创</el-tag>
                        <span v-text="wall.created_time"></span>
                    </div>
                    <div class="img" v-if="wall.file_path">
                        <img :src="'hlbb/'+wall.file_path" alt="">
                    </div>
                    <div v-html="wall.describe" class="descs"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import request from './request.js'
import wangEditor from 'wangeditor'
import config from './config.js'
import cookie from './util/cookie.js'

export default{
    mounted: function() {
            var me = this;
            me.editor = new wangEditor('desc');
            me.editor.config.menus = config.menus;
            me.editor.config.hideLinkImg = false;
            me.editor.onchange = function () {
               me.wall.describe = this.$txt.html();
            };
            me.editor.create();
            if(me.$route.params.isReview){
                me.isReview = me.$route.params.isReview;
            }
            me.getWallDetailById();
    },
    data() {
        return {
            fileList:[],
            isReview:false,
            wall:{
                id:'',
                title:'',
                subtitle:'',
                describe:'',
                fileId:'',
                created_time:new Date().pattern('yyyy-MM-dd'),
                file_path:'',
                status_note:'',
                status:''
            },
            uploadParam: {
                type: 'company_wall',
                tableName: 'company_wall',
                primaryValue:'',
                uid: cookie.getCookie('user-id')
            }
        }
    },
    methods:{
        onSubmit:function(){
            var me = this;
            if(!me.wall.title.trim()){
                me.$message({
                    message: "请输入展示标题",
                    type: 'warning'
                });
                return;
            }
            if(!me.wall.fileId){
                me.$message({
                    message: "必须上传题图",
                    type: 'warning'
                });
                return;
            }
            me.wall.describe = me.editor.$txt.html()
            if(!me.wall.describe.trim()){
                me.$message({
                    message: "请填写内容详情",
                    type: 'warning'
                });
                return;
            }
            request.post('company/saveWall',me.wall).then(function(res) {
                if (res.data.success) {
                    me.wall.id = res.data.wallId;
                    me.uploadParam.primaryValue = res.data.wallId;
                    me.$refs.upload.submit();
                    me.$message({
                        message: "保存成功",
                        type: 'success'
                    });
                }
            });
        },
        beforeAvatarUpload:function(file) {
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
            const isLt2M = file.size / 1024 / 1024 < 1;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 1MB!');
            }
            return isJPG && isLt2M;
        },
        uploadSuccess:function(res){
            this.wall.file_path = res.filePath;
            this.wall.fileId = res.fileId;
        },
        getWallDetailById:function(){
            var me = this;
            var wallId = this.$route.params.wallId;
            if(!wallId){
                return;
            }
            me.wall.id = this.$route.params.wallId;
            request.get('company/getWallById',{wallId:wallId}).then(function(res) {
                me.editor.$txt.html(res.data.describe);
                me.wall = res.data;
            });
        },
        submitReview:function(){
            var me=this;
            request.post('company/changeWallStatus',{
                wallId:me.wall.id,
                status:1
            }).then(function(res) {
                if (res.data.success) {
                    me.wall.status = 1;
                    me.$message({
                        message: "提交审核成功",
                        type: 'success'
                    });
                }
            });
        },
        changeWallStatus:function(status){
            var me=this;
            if(status == 3){
                me.$prompt('简单描述审核不通过原因', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(({ value }) => {
                    if(!value){
                        $message.alert('请填写审核不通过原因');
                        return;
                    }
                    me.submitStatus(status,value);
                });
            }else{
                me.submitStatus(status,"");
            }
        },
        submitStatus:function(status,note){
            var me=this;
            request.post('company/changeWallStatus',{
                wallId:me.wall.id,
                status:status,
                note:note
            }).then(function(res) {
                if (res.data.success) {
                    me.$message({
                        message: "处理成功",
                        type: 'success'
                    });
                }
            });
        }
    }
}
</script>
<style>
.wall #desc{
    height:400px;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }
  .avatar {
    width: 340px;
    height: 150px;
    display: block;
  }
  .s-remark{
      padding:10px;
      font-size:14px;
  }
  .phone-con{
    background:url(./assets/phone-case.png) no-repeat;
    position:relative;
    height:800px;
    width:375px;
  }
  .card-con{
    position:absolute;
    top:90px;
    left:5px;
    width:335px;
    padding:0 10px;
    height:590px;
    background:#eeeef4;
  }
  .card-con .card{
      background-color:#fff;
      border-radius:3px;
      border:1px solid #ddd;
      padding:10px;
  }
  .card div{
      padding-bottom:6px;
  }
  .card .title{
    font-size:20px;
    color:#000000;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .card .time{
      font-size:14px;
      color:#999;
  }
  .card .subtitle{
      font-size:14px;
      color:#999;
  }
  .card .img{
      width:100%;
  }
  .card .img img{
      width:100%;
  }
  .card .readline{
      border-top:1px solid #ddd;
      font-size:14px;
      padding:7px 0 0 0;
      position:relative;
  }
  .card .readline i{
      position:absolute;
      right:12px;
      top:10px;
      color:#999;
  }
  .detail{
      background:#fff;
      padding-top:20px;
      height:570px;
      overflow:auto;
  }
  .detail div{
      padding-bottom:12px;
  }
  .detail .title{
      padding-top:6px;
      text-align:center;
      font-size:20px;
  }
  .detail .info{
      font-size:14px;color:#999;
  }
  .detail .info span{
      margin:0 5px;
  }
  .detail .img{
      width:100%;
  }
  .detail .img img{
      width:100%;
  }
  .detail .descs{
      color:#999 !important;
      font-size:13px;
  }
</style>