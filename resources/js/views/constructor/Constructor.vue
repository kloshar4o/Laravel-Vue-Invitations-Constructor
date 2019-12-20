<template>
    <div>
        <header class="header">
            <div class="container">
                <div class="header__wrap">

                    <div class="header__menubtn js__open-menu" @click="openMenu = !openMenu">
                        <div class="hamburger" :class="{active: openMenu}"><span></span>
                        </div>
                    </div>

                    <div class="header__logo">
                        <router-link :to="{ name: 'Constructor' }">
                            <picture>
                                <img src="img/logo.png" alt="">
                            </picture>
                        </router-link>
                    </div>

                    <div class="header__text">
                        <span>Онлайн-редактор открыток для {{user}}</span>
                    </div>


                    <router-link :to="{ name: 'Admin', params: {page: $root.adminPage} }"
                                 v-if="$auth.check() && showNav">Админ
                    </router-link>

                    <router-link :to="{ name: 'Login' }" v-if="!$auth.check() && showNav">Логин</router-link>

                    <router-link :to="{ name: 'Register' }" v-if="!$auth.check() && showNav">Регистрация</router-link>


                    <a href="#" @click.prevent="$auth.logout()" v-if="$auth.check() && showNav">Выйти</a>

                    <a href="/">Вернуться на сайт</a>


                </div>
            </div>
        </header>

        <constructor
            :user="user"
            :userType="userType"
            :openMenu="openMenu"
            :textAreas="textAreas"
            :lists="lists"
            :options="options"
            :images="$root.data['images']"
            :sizes="$root.data['sizes.json']"
            @closeMenu="openMenu = false"
            @initOptions="initOptions">
        </constructor>
    </div>
</template>


<script>
    import Vue from 'vue';
    import axios from 'axios';

    import constructor from './components/app';
    Vue.component('constructor', constructor);

    import VueCookies from 'vue-cookies'
    Vue.use(VueCookies)

    export default {
        data() {
            return {
                user: 'Клиент',
                userType: 'client',
                options: false,
                openMenu: false,
                showNav: false,
                lists: [
                    {menu_name: 'Список средств', title: 'Список средств', type: 'lists', id: 'listoffunds', client: 0}
                ],
                textAreas: [
                    {menu_name: 'Подпись', title: 'Подпись', type: 'textAreas', id: 'signature', client: 1},
                    {
                        menu_name: 'Ссылка на страницу',
                        title: 'Ссылка на страницу',
                        type: 'textAreas',
                        id: 'pagelink',
                        client: 0
                    },
                ],
            }
        },
        watch: {
            'options': {
                handler(val) {
                    VueCookies.set('options', val);
                },
                deep: true
            }
        },
        methods: {
            lang(value) {

                switch (value) {

                    case 'consultant':
                        return 'консультантов';
                    case 'client':
                        return 'клиентов';
                }
            },
            initOptions() {
                let firstSize = this.$root.data['sizes.json'][0];

                this.options = VueCookies.get('options') || {
                    size: firstSize,
                    drags: [],
                    background: {},
                    signature: '',
                    link: '',
                    products: [],
                    activeImages: [],
                }

                this.$root.loading = false;
                this.$forceUpdate();

            },
        },
        beforeRouteEnter(to, from, next) {
            const user = to.params.user; //client or consultant

            if (!user) {
                next(vm => {

                    if (vm.$auth.check()) {

                        vm.$router.push('consultant');

                    } else {

                        vm.$router.push('client');
                    }
                })
            } else {

                //get images from public api
                next(vm => {
                    if (user === 'client' || user === 'consultant') {

                        vm.user = vm.lang(user);
                        vm.userType = user;

                        vm.$root.setRootData('images', () => {

                            vm.$root.setRootData('sizes.json', () => {

                                vm.initOptions();
                            })
                        })

                    } else
                        vm.$router.push({name: '404'});

                })


            }

        }
    }
</script>
