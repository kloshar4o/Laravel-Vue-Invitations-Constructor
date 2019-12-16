<template>
    <div>
        <header class="header">
            <div class="container">
                <div class="header__wrap">

                    <div class="header__menubtn js__open-menu">
                        <div class="hamburger" @click="openMenu = !openMenu;" :class="{active: openMenu}"><span></span>
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


                    <router-link :to="{ name: 'Admin', params: {page: $root.adminPage || 'client'} }" v-if="$auth.check() && false">Админ</router-link>

                    <router-link :to="{ name: 'Login' }" v-if="!$auth.check()">Логин</router-link>

                    <router-link :to="{ name: 'Register' }" v-if="!$auth.check()">Регистрация</router-link>


                    <a href="#" @click.prevent="$auth.logout()" v-if="$auth.check() && false ">Выйти</a>

                    <a href="#Вернуться-на-сайт">Вернуться на сайт</a>


                </div>
            </div>
        </header>

        <constructor

            :imagesData="$root.data.images"
            :textAreas="textAreas"
            :sizes="sizes"
            :options="options"
            :lists="lists"
            :user="user"
            :openMenu="openMenu"
            @closeMenu="openMenu = false"
            @optionsUpdated="updateOptions">

        </constructor>
    </div>
</template>


<script>
    import Vue from 'vue';
    import constructor from './components/app';

    Vue.component('constructor', constructor)

    export default {
        data() {
            return {
                user: 'Клиент',
                error: null,
                options: null,
                openMenu: false,
                lists: [
                    {menu_name: 'Список средств', title: 'Список средств', type: 'lists', id: 'listoffunds', client: 0}
                ],
                textAreas: [
                    {menu_name: 'Подпись', title: 'Подпись', type: 'textAreas', id: 'signature', client: 1},
                    {menu_name: 'Ссылка на страницу', title: 'Ссылка на страницу', type: 'textAreas', id: 'pagelink', client: 0},
                ],
                sizes: [
                    {img: 'facebook', name: 'Для поста Facebook', width: 1200, height: 630},
                    {img: 'instargam', name: 'Instagram и мессенджеры', width: 1080, height: 1080},
                    {img: 'insagram', name: 'Для поста Instagram Stories', width: 1080, height: 1920},
                    {img: 'vk', name: 'Для поста Вконтакте', width: 1200, height: 630},
                    {img: 'ok', name: 'Для поста OK.ru', width: 1680, height: 1680},
                    {img: 'tw', name: 'Для поста Twitter', width: 1024, height: 512},
                ],

            }
        },
        methods: {
            lang(value){

                switch (value) {

                    case 'consultant':
                        return 'консультантов'
                    case 'client':
                        return 'клиентов'
                }
            },
            updateOptions(options) {
                this.options = options
            },
        },
        beforeRouteEnter(to, from, next) {
            const user = to.params.user;

            if (!user) {

                next(vm => {

                    if (vm.$auth.check()) {

                        vm.$router.push('consultant');

                    } else {

                        vm.$router.push('client');
                    }
                })
            } else {

                next(vm => {
                    if (user === 'client' || user === 'consultant') {
                        vm.$root.user = user;
                        vm.user = vm.lang(user)
                        vm.$root.getData('images', to.path, (err, data, query, user) => {
                            vm.$root.setData(err, data, query);
                            vm.$forceUpdate();
                        })
                    } else {

                        vm.$router.push({name: '404'});
                    }
                })


            }

        }
    }
</script>
