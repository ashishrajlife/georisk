import Home from '../../usermanagementapp/src/components/Home.vue'
import userSignUp from './components/userSignUp.vue'
import Login from './components/Login.vue';
import AddData from './components/AddData.vue';
import {createRouter,createWebHashHistory} from 'vue-router'


const routes =[
    {
        name:'Home',
        component:Home,
        path:'/Home'
    },
    {
        name:'userSignUp',
        component:userSignUp,
        path:'/'
    },
    {
        name:'Login',
        component:Login,
        path:'/login'
    },
    {
        name:'adddata',
        component:AddData,
        path:'/adddata'
    }

];

const router = createRouter({
    history:createWebHashHistory(),
    routes
})

export default router;