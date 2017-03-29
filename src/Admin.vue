<template>
<div class="vbox flex1">
	<el-menu theme="dark" default-active="2" class="el-menu-demo" mode="horizontal" >
      	<el-menu-item index="1" style="font-size: 20px;color:#fff">海里巴巴后台</el-menu-item>
    </el-menu>
    <div class="hbox flex1">
        <div class="left-menu hbox">
            <el-menu theme="dark" :default-active="defaultActive" class="el-menu-vertical-demo flex1" @select="menuSelect">
                <el-submenu v-for="(m,index) in menus" :index="m.id">
                    <template slot="title"><i v-bind:class="m.icon"></i><span v-text="m.name"></span></template>
                    <el-menu-item v-if="m.children.length>0" :index="item.id" v-for="(item,i) in m.children"><i v-bind:class="item.icon"></i><span v-text="item.name"></span></el-menu-item>
                </el-submenu>
            </el-menu>
        </div>
        <div class="vbox flex1">
            <div style="padding: 15px 15px 20px 15px;background: #eee">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item>工作台</el-breadcrumb-item>
                    <el-breadcrumb-item v-if="twoMenuTxt">{{twoMenuTxt}}</el-breadcrumb-item>
                    <el-breadcrumb-item style="color:#00aaff" v-if="actionMenuTxt">{{actionMenuTxt}}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <router-view></router-view>
        </div>
    </div>
</div>
</template>
<script>
import request from './request.js'
export default {
    mounted(){
        var me=this;
        me.defaultActive = this.$route.name;
        me.loadMenus();
    },
    data() {
        return {
            twoMenuTxt:'',
            actionMenuTxt:'',
            defaultActive:'',
            menus:[]
        }
    },

    methods: {
        menuSelect(index,n,v) {
            var me=this;
            this.$router.push({
                name: index
            });
            var pid = n[0];
            for(var i=0;i<me.menus.length;i++){
                if(me.menus[i].id == pid){
                    me.twoMenuTxt = me.menus[i].name;
                    break;
                }
            }
            me.actionMenuTxt = v.$el.innerText;
        },
        loadMenus(){
            var me=this;
            request.get('module/getModulesByMngId').then(function(res){
                console.log(res.data);
                me.menus = res.data;
            });
        }
    }
}	
</script>
<style>
	html,
    body {
        font-family: "Hiragino Sans GB", "Microsoft Yahei", SimSun, Arial, "Helvetica Neue", Helvetica;
        margin: 0;
        padding: 0;
        height: 100%;
    }
    .el-menu-vertical-demo{
        border-radius: 0;
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
    
    .flex1-5 {
        -webkit-box-flex: 1.5;
        -moz-box-flex: 1.5;
        box-flex: 1.5;
    }
    
    .flex2 {
        -webkit-box-flex: 2;
        -moz-box-flex: 2;
        box-flex: 2;
    }
    
    .flex3 {
        -webkit-box-flex: 3;
        -moz-box-flex: 3;
        box-flex: 3;
    }
    
    .main {
        height: 100%;
    }
    
    .left-menu {
        width: 200px;
    }
    
    .spaceing {
        width: 20px;
        background: #e4e8f1
    }
</style>