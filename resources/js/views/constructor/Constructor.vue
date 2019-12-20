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
                oldOptions: false,
                openMenu: false,
                showNav: false,
                matArray: this.$root.data['mat.json'],
                mat: /\w{0,5}[хx]([хx\s\!@#$%\^&*+-\|\/]{0,6})[уy]([уy\s\!@#$%\^&*+-\|\/]{0,6})[ёiлeеюийя]\w{0,7}|\w{0,6}[пp]([пp\s\!@#$%\^&*+-\|\/]{0,6})[iие]([iие\s\!@#$%\^&*+-\|\/]{0,6})[3зс]([3зс\s\!@#$%\^&*+-\|\/]{0,6})[дd]\w{0,10}|[сcs][уy]([уy\!@#$%\^&*+-\|\/]{0,6})[4чkк]\w{1,3}|\w{0,4}[bб]([bб\s\!@#$%\^&*+-\|\/]{0,6})[lл]([lл\s\!@#$%\^&*+-\|\/]{0,6})[yя]\w{0,10}|\w{0,8}[её][bб][лске@eыиаa][наи@йвл]\w{0,8}|\w{0,4}[еe]([еe\s\!@#$%\^&*+-\|\/]{0,6})[бb]([бb\s\!@#$%\^&*+-\|\/]{0,6})[uу]([uу\s\!@#$%\^&*+-\|\/]{0,6})[н4ч]\w{0,4}|\w{0,4}[еeё]([еeё\s\!@#$%\^&*+-\|\/]{0,6})[бb]([бb\s\!@#$%\^&*+-\|\/]{0,6})[нn]([нn\s\!@#$%\^&*+-\|\/]{0,6})[уy]\w{0,4}|\w{0,4}[еe]([еe\s\!@#$%\^&*+-\|\/]{0,6})[бb]([бb\s\!@#$%\^&*+-\|\/]{0,6})[оoаa@]([оoаa@\s\!@#$%\^&*+-\|\/]{0,6})[тnнt]\w{0,4}|\w{0,10}[ё]([ё\!@#$%\^&*+-\|\/]{0,6})[б]\w{0,6}|\w{0,4}[pп]([pп\s\!@#$%\^&*+-\|\/]{0,6})[иeеi]([иeеi\s\!@#$%\^&*+-\|\/]{0,6})[дd]([дd\s\!@#$%\^&*+-\|\/]{0,6})[oоаa@еeиi]([oоаa@еeиi\s\!@#$%\^&*+-\|\/]{0,6})[рr]\w{0,12}/ig,

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

                    let oldValue = this.oldOptions || {};

                    this['textAreas'].forEach(input => {


                        let id = input.id;

                        if (val[id] !== oldValue[id])
                            val = this.matFilter(id, val)


                    });

                     val.products.forEach((product, i) => {

                         for (let inputId in product) {

                             if(!oldValue.products)
                                 oldValue.products = [];

                             if (oldValue.products[i] && val.products[i][inputId] !== oldValue.products[i][inputId])
                                product = this.matFilter(inputId, product)

                         }
                     });



                    this.oldOptions = JSON.parse(JSON.stringify(val));
                    VueCookies.set('options', val);
                },
                deep: true
            }
        },
        /*            'options.signature'(text) {
                if(text){

                    text = text.replace(this.mat, ' ');

                    this.matArray.forEach(word => {
                        text = text.replace(new RegExp(word, 'g'), '');
                    });

                    this.options.signatureMat = text;
                } else {
                    this.options.signatureMat = '';
                }
            },*/
        methods: {
            matFilter(id, val) {

                if (val[id]) {

                    let text = '';

                    text = val[id].replace(this.mat, ' ');

                    this.$root.data['mat.json'].forEach(word => {
                        text = text.replace(new RegExp(word, 'ig'), '');
                    });

                    val[id + 'Mat'] = text;
                } else {
                    val[id + 'Mat'] = '';
                }

                return val;

            },
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

                                vm.$root.setRootData('mat.json', () => {

                                    vm.initOptions();

                                })
                            })
                        })

                    } else
                        vm.$router.push({name: '404'});

                })


            }

        }
    }
</script>
