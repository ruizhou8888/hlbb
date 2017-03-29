<template>
<div class="bk">
    <div class="login-con">
        <div class="hint-info">
            <div class="ads1">
                <div class="title">抢人、永远快人一步</div>
                <div class="sub-title">专注于船员求职，直接通过平台与求职者面试</div>
            </div>
            <div class="ads2">
                <div class="title">海量优质人才、供您选择</div>
                <div class="sub-title">在线面试，沟通便捷，提高效率</div>
            </div>
        </div>
        <div class="login">
            <div class="top-tab hbox">
                <div class="flex1 nowidth" :class="{'active':curTab==1}" @click="switchTab(1)"><span>企业登录</span></div>
                <div class="flex1 nowidth" :class="{'active':curTab==2}" @click="switchTab(2)"><span>企业注册</span></div>
            </div>
            <div class="error" v-if="errorMsg.length>0" v-text="errorMsg"></div>
            <div class="login-form" v-if="curTab==1">
                <el-form ref="form" :model="user" label-width="80px">
                    <el-input
                        class="inline-input login-input"
                        size="large"
                        placeholder="邮箱账号"
                        v-model="user.userName">
                    </el-input>
                    <el-input
                        style="margin-top:25px"
                        class="inline-input login-input"
                        type="password"
                        size="large"
                        placeholder="密码"
                        v-model="user.password">
                    </el-input>
                    <div style="padding:15px;">
                        <el-button @click="login" :loading="logining" style="width:100%;margin-top:20px;" type="primary" size="large">{{loginTxt}}</el-button>
                    </div>
                </el-form>
            </div>
            <div class="login-form" v-if="curTab==2">
                <el-form ref="form" :model="regUser" label-width="80px">
                    <el-input
                        class="inline-input login-input"
                        size="large"
                        placeholder="设置登录邮箱账号"
                        v-model="regUser.email">
                    </el-input>
                    <el-input
                        class="inline-input login-input codeinput"
                        size="large"
                        name="checkCode"
                        placeholder="验证码"
                        v-model="regUser.checkCode">
                        <template slot="append" >
                            <span @click="getEmailCode">获取验证码</span>
                        </template>
                    </el-input>
                    <el-input 
                        style="margin-top:25px" 
                        class="inline-input login-input" 
                        type="password" size="large" placeholder="设置密码" 
                        v-model="regUser.password">
                    </el-input>
                    <el-input 
                        style="margin-top:25px" 
                        class="inline-input login-input" type="password" size="large" placeholder="请确认密码" v-model="regUser.surepwd">
                    </el-input>
                    <div style="padding:15px;">
                        <el-button @click="register" style="width:100%;margin-top:20px;" type="primary" size="large">注册</el-button>
                    </div>
                    <div style="text-align:center;padding:20px 0">
                        <a @click="curTab=1" class="link">已有账户？直接登录</a>
                    </div>
                </el-form>
            </div>
        </div>
    </div>
</div>
</template>
<script>
    import request from './request.js'
    import cookie from './util/cookie.js'

    export default {
        components: {
            CommonHeader: require('./component/CommonHeader.vue')
        },
        data() {
            return {
                logining: false,
                curTab: 1,
                errorMsg: '',
                codeImg: null,
                user: {
                    userName: '',
                    password: ''
                },
                regUser: {
                    checkCode:'',
                    email: '',
                    surepwd: '',
                    password: ''
                }
            }
        },
        watch: {
            'user.userName': function() {
                this.errorMsg = ''
            },
            'user.password': function() {
                this.errorMsg = ''
            },
        },
        computed: {
            loginTxt: function() {
                return !this.logining ? '登录' : '登录中...';
            }
        },
        methods: {
            switchTab: function(t) {
                this.curTab = t;
                this.errorMsg = '';
            },
            getEmailCode:function(){
                var me=this;
                if(!this.regUser.email.trim()){
                    me.errorMsg="请输入登录邮箱";
                    return;
                }
                var reg=/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/  
                if(!reg.test(me.regUser.email)){  
                    me.errorMsg="您输入的邮箱格式不对";
                    return;
                }
                request.post('manager/getEmailCode',{email:this.regUser.email}).then(function(res) {
                    if (res.data.success) {
                        me.$message({
                            message: "验证码已发送",
                            type: 'success'
                        });
                    }
                })
            },
            refreshImg:function(event){
                event.currentTarget.src="hlbb/common/getIdCode?d="+new Date().getTime();
            },
            login: function() {
                var me = this;
                if (!me.user.userName || !me.user.password) return;
                me.logining = true;
                request.post('manager/mngLogin', me.user).then(function(res) {
                    me.logining = false;
                    if (res.data.success && res.data.mng) {
                        if(res.data.company_status!=5){
                            cookie.setCookie('user-id', res.data.mng.id, 7);
                            var params = {
                                id:res.data.mng.id,
                                company_status:res.data.company_status,
                                company_id:res.data.mng.company_id
                            }
                            me.$router.push({name:'Register',params:params});
                        }else{
                            me.errorMsg = '';
                            cookie.setCookie('user-id', res.data.mng.id, 7);
                            cookie.setCookie('company-id', res.data.mng.company_id, 7);
                            me.$router.push({
                                name:'Admin'
                            });
                        }
                    } else {
                        me.errorMsg = res.data.message;
                    }
                })
            },
            register:function(){
                var me=this;
                if(!me.regUser.email){
                     me.errorMsg="请输入登录邮箱";
                     return;
                }
                if(!me.regUser.checkCode){
                     me.errorMsg="请输入验证码";
                     return;
                }
                if(!me.regUser.password){
                     me.errorMsg="请输入密码";
                     return;
                }
                if(!me.regUser.surepwd){
                     me.errorMsg="请再次输入密码";
                     return;
                }
                if(me.regUser.surepwd.trim() !== me.regUser.password.trim()){
                     me.errorMsg="两次输入密码不一致";
                     return;
                }
                var reg=/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/  
                if(!reg.test(me.regUser.email)){  
                    me.errorMsg="您输入的邮箱格式不对";
                    return;
                }  
                request.post('manager/register',me.regUser).then(function(res) {
                    if(res.data.success){
                        me.$router.push({name:'Register',params:{id:me.data.mng.id}});
                    }else{
                         me.errorMsg = res.data.errorMsg;
                    }
                })
            }
        }
    }
</script>
<style>
    html,
    body {
        background: #F8F9FC;
        height: 100%;
    }
    
    .hbox {
        display: -webkit-box;
        display: -moz-box;
        display: box;
        -webkit-box-orient: horizontal;
        -moz-box-orient: horizontal;
        box-orient: horizontal;
    }
    
    .vbox {
        display: -webkit-box;
        display: -moz-box;
        display: box;
        -webkit-box-orient: vertical;
        -moz-box-orient: vertical;
        box-orient: vertical;
    }
    
    .nowidth {
        width: 0;
    }
    
    .flex1 {
        -webkit-box-flex: 1;
        -moz-box-flex: 1;
        box-flex: 1;
    }
    
    .bk {
        height: 500px;
        background-color: #01A0E9;
        margin-top: 71px;
    }
    
    .login-con {
        margin: 0 auto;
        width: 1280px;
        height: 100%;
        position: relative;
    }
    
    .hint-info {
        position: absolute;
        top: 50%;
        left: 100px;
        width: 434px;
        height: 258px;
        margin-top: -129px;
        color: #fff;
    }
    
    .hint-info .ads1 {
        background: url(assets/login/ads1.png) no-repeat;
        background-position: 15px center;
        background-size: 65px;
        padding-left: 95px;
    }
    
    .hint-info .ads2 {
        background: url(assets/login/ads2.png) no-repeat;
        background-position: 15px center;
        background-size: 65px;
        padding-left: 95px;
        margin-top: 60px;
    }
    
    .hint-info .title {
        font-size: 26px;
    }
    
    .hint-info .sub-title {
        padding-top: 10px;
        font-size: 16px;
        color: rgba(255, 255, 255, 0.9);
    }
    
    .login-con .login {
        width: 350px;
        position: absolute;
        top: 60px;
        right: 50px;
        background: #fff;
        border: 1px solid #ebebeb;
        padding: 28px 48px;
    }
    
    .top-tab div {
        text-align: center;
        font-size: 14px;
        font-weight: bold;
        color: #666667;
        cursor: pointer;
    }
    
    .top-tab div span {
        padding-bottom: 12px;
        width: 65%;
        display: inline-block;
    }
    
    .top-tab div.active span {
        color: #00beff;
        border-bottom: 3px solid #00beff;
    }
    
    .login-form {
        padding: 30px 0;
    }
    
    .login-input {
        background: #f8f8f8;
    }
    
    .codeinput {
        margin-top: 25px;
    }
    
    .link {
        color: #00AAFF;
        cursor: pointer;
    }
    
    .desc {
        text-align: center;
        color: #D9D1D1;
        font-size: 17px;
        height: 300px;
        line-height: 300px;
    }
    
    .error {
        color: red;
        font-size: 14px;
        padding: 15px 0 0 0;
    }
    .el-input-group__append {
        border-left: 0;
        cursor:pointer;
    }
</style>