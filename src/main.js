import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import App from './App.vue'
import VueRouter from "vue-router"
import date from './util/date.js'


date.init();
Vue.use(ElementUI)
Vue.use(VueRouter)

const routes = [
    { 
        name:'Admin',path: '/Admin', component: require('./Admin.vue'),
        children:[
            { name: 'Mng', path: 'Mng', component: require('./Manager.vue') },
            { name: 'Role', path: 'Role', component: require('./Role.vue') },
            { name: 'Constant', path: 'Constant', component: require('./Constant.vue') },
            { name: 'Company', path: 'Company', component: require('./Company.vue') },
            { name: 'JobMng', path: 'JobMng', component: require('./JobMng.vue') },
            { name: 'ReceiveResume', path: 'ReceiveResume', component: require('./ReceiveResume.vue') },
            { name: 'CollectCrew', path: 'CollectCrew', component: require('./CollectCrew.vue') },
            { name: 'BlackCrew', path: 'BlackCrew', component: require('./BlackCrew.vue') },
            { name: 'SearchCrew', path: 'SearchCrew', component: require('./SearchCrew.vue') },
            { name: 'Notice', path: 'Notice', component: require('./Notice.vue') },
            { name: 'NewNotice', path: 'NewNotice', component: require('./NewNotice.vue') },
            { name: 'AllNotice', path: 'AllNotice', component: require('./AllNotice.vue') },
            { name: 'NewCompanyWall', path: 'NewCompanyWall', component: require('./NewCompanyWall.vue') },
            { name: 'CompanyWall', path: 'CompanyWall', component: require('./CompanyWall.vue') },
            { name: 'WaitReviewWall', path: 'WaitReviewWall', component: require('./WaitReviewWall.vue') },
            { name: 'WaitReviewCompany', path: 'WaitReviewCompany', component: require('./WaitReviewCompany.vue') }
        ]
    },
    {
        name:'Process',path:'/Process',component:require('./Process.vue'),
        children:[
            { name:'Login',path:'Login', component: require('./Login.vue') },
            { name:'Register',path: 'Register',component: require('./Register.vue') },
        ]
    }
]

const router = new VueRouter({
    routes // （缩写）相当于 routes: routes
})
const app = new Vue({
    router,
    render: function(h) {
        return h(App);
    }
}).$mount('#app')