import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios';
import VueAxios from 'vue-axios';

import App from './views/App.vue'
import Page404 from './views/404.vue';
import Constructor from './views/constructor/Constructor.vue'

import Admin from './views/admin/Admin.vue';
import Login from './views/admin/auth/Login.vue';
import Register from './views/admin/auth/Register.vue';

import Single from './views/Single.vue';

Vue.use(VueRouter);
Vue.use(VueAxios, axios);

let axiosPages = ['client', 'consultant', 'admin'];
let appPath = '/postcard/';


axios.defaults.baseURL = appPath + 'api';

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: appPath + '/',
            name: 'Constructor',
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


App.router = Vue.router;

const app = new Vue({
    el: '#app',
    components: {App},
    data() {
        return {
            appPath: null,
            errors: {},
            data: {},
            loading: false,
        }
    },
    methods: {
        setData(err, data, query) {

            this.loading = false;

            if (err) {
                this.errors[query] = err.toString();
            } else {
                this.data[query] = data;
            }

        },
        fetchApi(query, callback) {

            axios.get(query).then(response => {

                callback(null, response.data);

            }).catch(error => {

                console.log(error)
                callback(error, error.response.data);

            });
        },
        getData(query, curPath, callback) {
            if (!this.data[query]) {

                axiosPages.forEach(page => {
                    if (appPath + page === curPath || curPath === page) {

                        this.loading = true;
                        this.fetchApi(query, (err, data) => {

                            callback(err, data, query)
                        });
                    }
                });
            }
        }
    },
    created() {
        this.appPath = appPath;
    }
});

router.beforeEach((to, from, next) => {
    app.loading = true;
    next()
});

router.afterEach((to, from) => {
    app.loading = false
});
