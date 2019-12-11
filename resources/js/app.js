import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import App from './views/App.vue'
import Constructor from './views/Constructor.vue'
import Login from './views/Login.vue';
import Page404 from './views/404.vue';
import axios from 'axios';

let pagesToLoadImages = ['', 'client', 'consultant'];
let appPath = '/postcard/';


const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: appPath,
            name: 'Constructor',
            component: Constructor,
        },
        {
            path: appPath + 'admin',
            name: 'Login',
            component: Login
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
    ],
});

const app = new Vue({
    el: '#app',
    components: {App},
    router,
    data() {
        return {
            appPath: '/postcard/',
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

            axios.get(appPath + 'api/' + query).then(response => {

                callback(null, response.data);

            }).catch(error => {

                console.log(error)
                callback(error, error.response.data);

            });
        },
        getData(query, curPath, callback) {
            if(!this.data[query]){
                pagesToLoadImages.forEach(page => {
                    if (appPath + page === curPath) {

                        this.loading = true;
                        this.fetchApi(query, (err, data) => {

                            callback(err, data, query)
                        });
                    }
                });
            }
        }
    },
}).$mount;

router.beforeEach((to, from, next) => {
    app.loading = true;
    next()
});

router.afterEach((to, from) => {
    app.loading = false
});
