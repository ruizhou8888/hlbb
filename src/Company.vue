<template>
<div class="content"  v-loading="loading">
	<div class="info flex1 hbox">
		<div class="logo">
			<el-upload
                ref="upload"
                class="avatar-uploader"
                action="hlbb/common/upload"
                :show-file-list="false"
                :data="uploadLogoParam"
                :on-success="uploadSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="company.logo_path" :src="company.logo_path" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2M</div>
            </el-upload>
		</div>
		<el-form ref="form" :model="company" label-width="80px">
			<el-form-item label="公司名称">
			    <el-input disabled v-model="company.name"></el-input>
		  	</el-form-item>
		  	<div class="hbox">
				<hb-select
					class="flex1"
					label="性质"
					typeNo="company_nature"
                    v-on:change="changeNature"
					:val="company.nature"
				/>
		  		<hb-select
					class="flex1"
					label="规模"
					typeNo="company_size"
                    v-on:change="changeSize"
					:val="company.size"
				/>
				<el-form-item class="flex1" label="地域">
				    <el-input v-model="company.region" ></el-input>
			  	</el-form-item>
		  	</div>
		</el-form>
	</div>
	<el-tabs v-loading="loading" class="tabs"  :active-name="activeName">
	    <el-tab-pane label="公司简介" name="desc">
	    	<div id="desc"></div>
	    	<div class="buttons">
		  		<el-button type="primary" @click="saveCompanyInfo">保存信息</el-button>
		  	</div>
	    </el-tab-pane>
	    <el-tab-pane label="公司/船舶展示" name="pic">
	    	<el-upload
			  action="hlbb/common/upload"
			  :multiple="true"
              list-type="picture-card"
			  :on-preview="pictureCardPreview"
              :on-remove="handleRemove"
              :before-upload="beforeUpload"
              :data="uploadParam"
              accept="image/jpeg,image/jpg,image/png"
              :file-list="fileList"
            >
              <i class="el-icon-plus"></i>
			</el-upload>
	    </el-tab-pane>
  	</el-tabs>
    <el-dialog v-model="viewImg" size="small">
        <img width="100%" :src="imageUrl" alt="">
    </el-dialog>
</div>
</template>
<script>
    import request from './request.js'
    import HbSelect from './component/HbSelect.vue'
    import wangEditor from 'wangeditor'
    import config from './config.js'
    import cookie from './util/cookie.js'

    export default {
        components: {
            HbSelect
        },
        mounted: function() {
            var me = this;
            me.editor = new wangEditor('desc');
            me.editor.config.menus = config.menus;
            me.editor.create();
            me.loadCompanyInfo();
            me.loadImgs();
        },
        data() {
            return {
                loading:true,
                viewImg: false,
                imageUrl: '',
                fileList: [],
                activeName: 'desc',
                companyId: cookie.getCookie('company-id'),
                uploadParam: {
                    type: 'company',
                    tableName: 'company',
                    primaryValue: cookie.getCookie('company-id'),
                    uid: cookie.getCookie('user-id')
                },
                company: {
                    nature: 0,
                    size: 0,
                    region:'',
                    logo_path:''
                },
                uploadLogoParam: {
                    type: 'company_logo',
                    tableName: 'company',
                    primaryValue:cookie.getCookie('company-id'),
                    uid: cookie.getCookie('user-id')
                }
            }
        },
        watch: {
            'company.remark': function() {
                this.editor.$txt.html(this.company.remark);
            }
        },
        methods: {
            changeNature: function(v) {
                this.company.nature = v.val;
            },
            changeSize: function(v) {
                this.company.size = v.val;
            },
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
            uploadSuccess(res){
                this.company.logo_path = res.filePath;
            },
            saveCompanyInfo: function() {
                var me = this;
                request.post('company/saveCompanyDesc', {
                    companyId: me.companyId,
                    nature:me.company.nature,
                    size:me.company.size,
                    region:me.company.region,
                    desc: me.editor.$txt.html()
                }).then(function(res) {
                    if (res.data.success) {
                        me.$message({
                            message: "保存成功",
                            type: 'success'
                        });
                    }
                });
            },
            loadCompanyInfo: function() {
                var me = this;
                request.get('company/getCompanyById', {
                    company_id: me.companyId
                }).then(function(res) {
                    console.log(res);
                    me.company = res.data;
                    me.loading = false;
                });
            },
            loadImgs: function() {
                var me = this;
                request.get('common/getUploadFiles', {
                    linkId: me.companyId,
                    type: 'company'
                }).then(function(res) {
                    me.fileList = res.data;
                });
            },
            pictureCardPreview: function(file) {
                this.viewImg = true;
                this.imageUrl = file.url;
            },
            handleRemove: function(file, filelist) {
                var me = this;
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
            beforeUpload: function(file) {
                if (file.type == 'image/png' || file.type == 'image/jpg' || file.type == 'image/jpeg') {
                    return true;
                } else {
                    return false;
                }
            }
        }
    }
</script>
<style scoped>
    .content {
        padding: 15px;
        width: 950px;
    }
    
    .logo {
        width: 160px;
        height: 200px;
    }
    
    .logo img {
        width: 100%;
        height: 100%;
    }
    
    .tabs {
        width: 1030px;
        height: 500px;
    }
    
    .tabs #desc {
        height: 500px;
    }
    
    .buttons {
        padding-left: 120px;
    }
</style>