<template>
<div class="hbox flex1">
    <el-row class="flex1">
        <el-col v-for="c in companys" :xs="6" :sm="6" :md="6" :lg="6">
            <div class="card" @click="viewDetail(c)" style="padding:10px;border:1px solid #d5d5d5;margin:10px;border-radius:3px;cursor:pointer">
                <div v-text="'名称：'+c.name"></div>
                <div v-text="'营业执照号：'+c.business_no"></div>
                <div style="padding:5px 0">
                    <img class="img" :src="c.business_licence_path" alt="">
                    <img class="img" :src="c.assignment_path" alt="">
                    <img class="img" :src="c.first_division_path" alt="">
                </div>
                <div class="readline">
                    <span>查看详情</span><span style="padding-left:25px;color:#007AFF">待审核</span><i class="el-icon-arrow-right zhishi"></i>
                </div>
            </div>
        </el-col>
        <div v-if="companys.length==0" class="empty">还没有新数据</div>
    </el-row>
    <el-dialog title="公司详情" v-model="showDetail" size="small">
        <div style="padding-left:50px;">
            <div class="pl">
                <span class="label">公司名称：</span>
                <span v-text="curComapny.name"></span>
            </div>
            <div class="pl">
                <span class="label">营业执照注册号：</span>
                <span v-text="curComapny.business_no"></span>
            </div>
            <div class="pl">
                <span class="label">企业联系人：</span>
                <span v-text="curComapny.contact_name"></span>
            </div>
            <div class="pl">
                <span class="label">企业联系人号码：</span>
                <span v-text="curComapny.contact_phone"></span>
            </div>
            <div class="pl">
                <img @click="viewImg(curComapny.business_licence_path)" class="limg" :src="curComapny.business_licence_path" alt="">
                <img @click="viewImg(curComapny.assignment_path)" class="limg" :src="curComapny.assignment_path" alt="">
                <img @click="viewImg(curComapny.first_division_path)" class="limg" :src="curComapny.first_division_path" alt="">
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="review(4)">审核不通过</el-button>
            <el-button type="primary" @click="review(5)">审核通过</el-button>
        </div>
    </el-dialog>
    <el-dialog title="查看图片" v-model="showImg" size="small">
        <img :src="viewImgPath" style="width:600px;" alt="">
    </el-dialog>
</div>
</template>
<script>
import request from './request.js'
export default {
    data(){
        return {
            page:1,
            loaded:false,
            companys:[],
            showDetail:false,
            curComapny:{},
            viewImgPath:'',
            showImg:false
        }
    },
    mounted(){
        this.loadReviewCompany();
    },
    methods:{
        loadReviewCompany(){
            var me=this;
            request.get('company/getWaitReviewCompany',{page:me.page}).then(function(res) {
                me.companys = res.data.list;
                me.loaded = true;
            })
        },
        viewDetail(c){
            this.showDetail = true;
            this.curComapny = c;
        },
        viewImg(path){
            this.viewImgPath = path;
            this.showImg = true;
        },
        review(n){
            var me=this;
            if(n==4){
                me.$prompt('简单描述审核不通过原因', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(({ value }) => {
                    if(!value){
                        $message.alert('请填写审核不通过原因');
                        return;
                    }
                    me.submitStatus(n,value);
                });
            }else if(n==5){
                me.$confirm('确定将状态改为审核通过吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    me.submitStatus(n,'');
                });
            }
        },
        submitStatus:function(status,note){
            var me=this;
            request.post('company/changeReviewStatus',{
                cid:me.curComapny.id,
                status:status,
                note:note
            }).then(function(res) {
                if (res.data.success) {
                    me.showDetail = false;
                    me.loadReviewCompany();
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
    .card .img{
        width:75px;
        display:inline-block;
    }
    .limg{
        width:150px;
        margin:0 35px 0 0;
        cursor:pointer;
    }
    .pl{
        margin:0 0 12px 0;
    }
    .label{
        width:150px;
        display:inline-block;
        color:#000;
        font-size:16px;
    }
</style>