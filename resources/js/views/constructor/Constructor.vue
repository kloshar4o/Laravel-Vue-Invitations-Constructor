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
                        <span>Онлайн-редактор открыток для консультантов</span>
                    </div>


                    <!--<router-link :to="{ name: 'Constructor' }">Редактор</router-link>-->
                    <router-link :to="{ name: 'Admin', params: {page: $root.adminPage || 'client'} }" v-if="$auth.check()">Админ</router-link>

                    <router-link :to="{ name: 'Login' }" v-if="!$auth.check()">Логин</router-link>

                    <router-link :to="{ name: 'Register' }" v-if="!$auth.check()">Регистрация</router-link>


                    <a href="#" @click.prevent="$auth.logout()" v-if="$auth.check()">Выйти</a>

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
                error: null,
                options: null,
                openMenu: false,
                lists: [
                    {menu_name: 'Список средств', title: 'Список средств', type: 'lists', id: 'listoffunds'}
                ],
                textAreas: [
                    {menu_name: 'Подпись', title: 'Подпись', type: 'textAreas', id: 'signature'},
                    {menu_name: 'Ссылка на страницу', title: 'Ссылка на страницу', type: 'textAreas', id: 'pagelink'},
                ],
                sizes: [
                    {img: 'facebook', name: 'Facebook', width: 1200, height: 630},
                    {img: 'insagram', name: 'Instagram', width: 1080, height: 1080},
                    {img: 'insagram', name: 'Instagram Stories', width: 1080, height: 1920},
                    {img: 'vk', name: 'Вконтакте', width: 1200, height: 630},
                    {img: 'ok', name: 'OK.ru', width: 1680, height: 1680},
                    {img: 'tw', name: 'Twitter', width: 1024, height: 512},
                ],

            }
        },
        methods: {
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
