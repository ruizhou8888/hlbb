<template>
<div>
	<div>
		<common-header></common-header>
        <router-view></router-view>
    </div>
    <div class="desc">
        <span>—</span><span style="padding:0 15px;">专注于船员招聘，只做最好</span><span>—</span>
    </div>
</div>
</template>
<script>
    export default {
        components: {
            CommonHeader: require('./component/CommonHeader.vue')
        },
        mounted(){
            
        }
    }
</script>
<style>
    
</style>