<template>
<div class="hbox flex1">
    <el-row class="flex1" >
        <el-col v-for="wall in walls"  :xs="6" :sm="6" :md="6" :lg="6">
            <div class="card" @click="viewDetail(wall)" style="padding:10px;border:1px solid #d5d5d5;border-radius:3px;margin:10px;cursor:pointer">
                <div class="title" v-text="wall.title"></div>
                <div class="time" v-text="wall.created_time"></div>
                <div class="img" v-if="wall.file_path">
                    <img :src="'hlbb/'+wall.file_path" alt="">
                </div>
                <div class="subtitle" v-text="wall.subtitle"></div>
                <div class="readline">
                    <span>阅读全文</span><span style="padding-left:25px;color:#007AFF" v-text="wall.status_name"></span><i class="el-icon-arrow-right zhishi"></i>
                </div>
            </div>
        </el-col>
        <el-col v-if="!lastPage"  :xs="6" :sm="6" :md="6" :lg="6">
            <div style="text-align:center;height:150px;line-height:150px;"><el-button @click="loadMore">查看更多</el-button></div>
        </el-col>
        <div v-if="loaded && walls.length==0" class="empty">暂无数据</div>
    </el-row>
</div>
</template>
<script>
import request from './request.js'
export default{
    mounted:function(){
        var me=this;
        me.loadData();
    },
    data() {
        return {
            page:1,
            loaded:false,
            lastPage:false,
            walls:[]
        }
    },
    methods:{
        roleCellClick:function(row, column, cell, event){
	      	event.stopPropagation();
	      	if(column.property !== 'title'){
	      		return;
	      	}
      	},
        viewDetail:function(wall){
            this.$router.push({
                name:'NewCompanyWall',
                params:{
                    wallId:wall.id,
                    status:wall.status,
                    isReview:true
                }
            });
        },
        loadData:function(){
            var me=this;
            request.get('company/getWalls',{page:me.page}).then(function(res){
                me.lastPage = res.data.lastPage;
                me.loaded = true;
                for(var i=0,j = res.data.list.length;i<j;i++){
                    me.walls.push(res.data.list[i]);
                }
            });
        },
        loadMore:function(){
            var me=this;
            me.page++;
            me.loadData();
        }
    }
}    
</script>
<style>
    .empty{
        padding:100px;
        text-align:center;
        color:#666;
    }
</style>