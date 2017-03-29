<template>
<div style="padding-top:100px;width:998px;margin:0 auto">
    <p style="color:#535353;font-size:18px;font-weight:bold;">海里巴巴注册</p>
    <div style="border:1px solid #eee;border-top:none">
        <div style="text-align:center;border-bottom:1px solid #eee;padding:15px 0">
            <el-steps :space="100" :active="active" finish-status="success">
                <el-step title="注册账号"></el-step>
                <el-step title="填写信息"></el-step>
                <el-step :title="titles[active]"></el-step>
                <el-step :title="results[active]"></el-step>
            </el-steps>
        </div>
        <div style="padding:30px;color:#353535;box-shadow: 0 1px 2px rgba(150,150,150,0.3);">
            <div v-if="active==3" style="text-align:center">您已提交审核，工作人员会尽快进行相关审核工作，请耐心等待！</div>
            <div v-if="active==4" style="text-align:center;color:red;font-size:18px;" v-text="'审核不通过原因：'+mng.status_note"></div>
            <div v-if="active==1 || active==2 || active == 4">
                <p style="font-size:18px;">用户信息登记</p><br>
                海里巴巴平台致力于打造真实、合法、有效的互联网平台。为了更好的保障你和广大用户的合法权益，请你认真填写以下登记信息。 
                <p style="font-size:18px;">主体信息登记</p><br>
                <el-form ref="ruleForm" :model="mng" :rules="rules" label-width="130px" style="width:600px;">
                    <el-form-item label="企业名称" prop="name">
                        <el-input v-model="mng.name" ></el-input>
                    </el-form-item> 
                    <p class="tip">需与当地政府颁发的商业许可证书或企业注册证上的企业名称完全一致，信息审核审核成功后，企业名称不可修改。</p>
                    <el-form-item label="营业执照注册号" prop="business_no">
                        <el-input v-model="mng.business_no"></el-input>
                    </el-form-item> 
                    <p class="tip">请输入15位营业执照注册号或18位的统一社会信用代码</p>
                    <el-form-item label="上传营业执照"  prop="business_licence_path">
                        <el-upload
                            class="avatar-uploader"
                            action="hlbb/common/upload"
                            :show-file-list="false"
                            :data="uploadParam"
                            :on-success="uploadBusinessSuccess"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="mng.business_licence_path" :src="mng.business_licence_path" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2M</div>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="上传外派证" prop="assignment_path">
                        <el-upload
                            class="avatar-uploader"
                            action="hlbb/common/upload"
                            :show-file-list="false"
                            :data="uploadAssignmentParam"
                            :on-success="uploadAssignmentSuccess"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="mng.assignment_path" :src="mng.assignment_path" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2M</div>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="甲级服务机构证" prop="first_division_path">
                        <el-upload
                            class="avatar-uploader"
                            action="hlbb/common/upload"
                            :show-file-list="false"
                            :data="uploadFirstDivisionParam"
                            :on-success="uploadFirstDivisionSuccess"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="mng.first_division_path" :src="mng.first_division_path" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2M</div>
                        </el-upload>
                    </el-form-item>
                    <p style="font-size:18px;">企业联系人信息</p><br>
                    <el-form-item label="联系人姓名" prop="contact_name">
                        <el-input v-model="mng.contact_name" ></el-input>
                    </el-form-item> 
                    <p class="tip">请填写该企业联系人的姓名。</p>
                    <el-form-item label="联系人电话" prop="contact_phone">
                        <el-input v-model="mng.contact_phone"></el-input>
                    </el-form-item> 
                    <p class="tip">请填写该企业联系人的手机号码</p>
                    <el-form-item>
                        <el-button @click="submitForm('ruleForm')">保存信息</el-button>
                        <el-button @click="submitReview('ruleForm')" style="margin-left:80px;" type="success">提交审核</el-button>
                    </el-form-item>
                </el-form> 
            </div>
        </div>

    </div>
</div>
</template>
<script>
import request from './request.js'
import cookie from './util/cookie.js'

export default{
    data (){
        return {
            active:1,
            email:'',
            titles:{
                1:'提交审核',
                2:'提交审核',
                3:'审核中',
                4:'已审核'
            },
            results:{
                1:'等待结果',
                2:'等待结果',
                3:'等待结果',
                4:'审核不通过'
            },
            loaded:false,
            isChange:false,
            mng:{
                id:'',
                status_note:'',
                name:'',
                business_no:'',
                business_licence_path:'',//营业执照路径
                assignment_path:'',
                first_division_path:'',
                business_licence_fileId:'',
                assignment_fileId:'',
                first_division_fileId:'',
                contact_name:'',
                contact_phone:'',
                mng_id:''
            },
            rules: {
                name: [
                    { required: true, message: '请输入企业名称', trigger: 'blur' }
                ],
                business_no: [
                    { required: true, message: '请输入营业执照注册号', trigger: 'blur' }
                ],
                business_licence_path:[
                    { required: true, message: '请上传营业执照', trigger: 'blur' }
                ],
                assignment_path:[
                    { required: true, message: '请上传外派证', trigger: 'blur' }
                ],
                first_division_path:[
                    { required: true, message: '请上传甲级服务机构证', trigger: 'blur' }
                ],
                contact_name: [
                    { required: true, message: '请输入企业联系人姓名', trigger: 'blur' }
                ],
                contact_phone: [
                    { required: true, message: '请输入企业联系人手机号', trigger: 'blur' }
                ]
            },
            uploadParam: {
                type: 'business_licence',
                tableName: 'company',
                primaryValue:'',
                uid: cookie.getCookie('user-id')
            },
            uploadAssignmentParam: {
                type: 'assignment',
                tableName: 'company',
                primaryValue:'',
                uid: cookie.getCookie('user-id')
            },
            uploadFirstDivisionParam: {
                type: 'first_division',
                tableName: 'company',
                primaryValue:'',
                uid: cookie.getCookie('user-id')
            }
        }
    },
    mounted (){
        this.mng.mng_id = this.$route.params.id;
        this.active = this.$route.params.company_status;
        if(this.$route.params.company_id){
            this.mng.id = this.$route.params.company_id;
            this.loadCompanyInfo();
        }
    },
    watch:{
        mng:{
            handler:function(val,oldVal){
                this.isChange =true;
            },
            deep:true
        }
    },
    methods:{
        beforeAvatarUpload:function(file) {
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        uploadBusinessSuccess:function(res){
            this.mng.business_licence_path = res.filePath;
            this.mng.business_licence_fileId = res.fileId;
        },
        uploadAssignmentSuccess:function(res){
            this.mng.assignment_path = res.filePath;
            this.mng.assignment_fileId = res.fileId;
        },
        uploadFirstDivisionSuccess:function(res){
            this.mng.first_division_path = res.filePath;
            this.mng.first_division_fileId = res.fileId;
        },
        submitForm:function(formName) {
            var me=this;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    request.post('company/registerCompany',me.mng).then(function(res) {
                        if (res.data.success) {
                            me.active = 2;
                            me.mng.id = res.data.cid;
                            me.$nextTick(function(){
                                me.isChange = false;
                            })
                            me.$message({
                                message: "已成功保存信息",
                                type: 'success'
                            });
                        }
                    })
                } else {
                    return false;
                }
            });
        },
        submitReview:function(){
            var me=this;
            console.log(me.isChange);
            if(me.isChange){
                me.$message({
                    message:'请先保存信息',
                    type:'warning'
                });
                return;
            }
            request.post('company/submitReview',{
                cid:me.mng.id
            }).then(function(res) {
                if (res.data.success) {
                    me.$message({
                        message: "已提交审核",
                        type: 'success'
                    });
                    me.active = 3;
                }
            })
        },
        loadCompanyInfo:function(){
            var me=this;
            request.get('company/getCompanyById',{company_id:me.mng.id}).then(function(res) {
                me.mng = res.data;
                me.loaded = true;
            })
        },
    }
}
</script>
<style >
.tip{
    color:#999;line-height:normal;
    padding-left:130px;
    font-size:14px;
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
    width: 150px;
    height: 200px;
    display: block;
  }
</style>