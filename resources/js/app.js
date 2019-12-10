import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import App from './views/App'
import Constructor from './views/Constructor'
import Login from './views/Login';
import UsersIndex from './views/UsersIndex';

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/postcard/admin',
            name: 'login',
            component: Login
        },
        {
            path: '/postcard/consultant',
            name: 'home',
            component: Constructor
        },
        {
            path: '/postcard/client',
            name: 'home',
            component: Constructor
        },
        {
            path: '/postcard/user/pages/:page',
            name: 'users.index',
            component: UsersIndex,
        },
    ],
});

const app = new Vue({
    el: '#app',
    components: { App },
    router,
});
