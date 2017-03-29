<template>
    <div class="vbox main">
        <router-view></router-view>
    </div>
</template>

<script>
import cookie from './util/cookie.js'
var userId = cookie.getCookie('user-id');
export default {
    mounted(){
        
    },
    beforeMount(){
        if (!this.userId) {
            this.$router.push({
                name:'Login'
            });
        }else{
            this.$router.push({
                name:'Admin'
            });
        }
    },
    data(){
        return{
            userId:cookie.getCookie('user-id')
        }
    }
}
</script>

<style>
    
</style>