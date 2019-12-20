import Vue from 'vue'
import axios from 'axios';

import App from './views/App.vue'
import Single from './views/Single.vue';
import Page404 from './views/404.vue';
import Constructor from './views/constructor/Constructor.vue'

import Admin from './views/admin/Admin.vue';
import Login from './views/admin/auth/Login.vue';
import Register from './views/admin/auth/Register.vue';


import VueRouter from 'vue-router'
Vue.use(VueRouter);


import VueAxios from 'vue-axios';
Vue.use(VueAxios, axios);

let appPath = '/';
axios.defaults.baseURL = appPath + 'api';

import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/index.css';
Vue.use(VueToast);

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: appPath,
            name: 'Home',
            component: Constructor,
        },
        {
            path: appPath + 'login',
            name: 'Login',
            component: Login,
            meta: {
                auth: false,
            }
        },
        {
            path: appPath + 'register',
            name: 'Register',
            component: Register,
            meta: {
                auth: false
            }
        },
        {
            path: appPath + 'admin/:page',
            name: 'Admin',
            component: Admin,
            meta: {
                auth: true
            }
        },
        {
            path: appPath + 'admin/',
            redirect: {
                name: 'Admin',
                params: {page: 'client'},
            }
        },
        {
            path: appPath + '404',
            name: '404',
            component: Page404
        },

        {
            path: appPath + ':user',
            name: 'Constructor',
            component: Constructor,
        },
        {
            path: appPath + ':user/:cardName',
            name: 'Single',
            component: Single,
        },
    ],
});

Vue.router = router;

Vue.use(require('@websanova/vue-auth'), {
    auth: require('@websanova/vue-auth/drivers/auth/bearer.js'),
    http: require('@websanova/vue-auth/drivers/http/axios.1.x.js'),
    router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js'),
    authRedirect: {path: appPath + 'login'},
    forbiddenRedirect: {path: appPath + 'admin'},
    notFoundRedirect: {path: appPath + 'admin'},
    registerData: {url: 'auth/register', method: 'POST', redirect: ''},
    loginData: {url: 'auth/login', method: 'POST', redirect: appPath + 'admin', fetchUser: true},
    logoutData: {url: 'auth/logout', method: 'POST', redirect: appPath + 'login', makeRequest: false},
});



const app = new Vue({
    router,
    el: '#app',
    components: {App},
    data() {
        return {
            appPath: appPath,
            data: {},
            loading: false,
        }
    },
    methods: {
        setRootData(query, callback = null) {
            if (!this.data[query]) { //get data only once

                this.loading = true;

                axios.get(query).then(res => {

                    this.data[query] = res.data;

                    if(callback)
                        callback(res.data);

                }).catch(error => {

                    Vue.$toast.error(error.toString());

                }).finally(() => {

                    if(!callback)
                        this.loading = false;
                });
            } else {

                if(callback)
                    callback();
            }
        }
    }
});

router.beforeEach((to, from, next) => {
    app.loading = true;
    next()
});

router.afterEach((to, from) => {
    app.loading = false
});
