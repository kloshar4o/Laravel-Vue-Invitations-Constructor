<template>
    <div>
        <header class="header header-admin">
            <div class="header__wrap">
                <div class="header__menubtn js__open-menu">
                    <div class="hamburger" @click="openMenu = !openMenu;" :class="{active: openMenu}"><span></span>
                    </div>
                </div>
                <div class="header__logo"><b>Режим администратора</b> <span><router-link
                    :to="{ name: 'Constructor' }">Онлайн-редактор</router-link> открыток</span>
                </div>
                <div class="header__text link"><a href="#">Открытки консультантов</a> <a href="#">Открытки клиентов</a>
                </div>
                <div class="header__link"><a href="#" @click.prevent="$auth.logout()" v-if="$auth.check()">Выйти</a>
                </div>
            </div>
        </header>

        <div id="wrapper">
            <div class="constructor__menu js__scroll" :class="{active: openMenu}">
                <div class="menu">
                    <div v-for="(menuItem, i) in $root.data.images" class="menu__item js__tab-btn"
                         :key="menuItem.id"
                         :ref="'menu'"
                         :class="{ 'active': menu.active === i }"
                         @click="menu.active = i">

                        <span>{{menuItem.menu_name}}</span>
                    </div>
                </div>
            </div>

            <div class="constructor__admin"
                 v-for="(cat, i) in $root.data.images"
                 :class="{ 'active': menu.active === i }"
                 :key="cat.id"
                 :id="i">
                <div class="admincontent elementcontent">
                    <h3>Элементы</h3>
                    <div class="elementcontent__btn">
                        <button class="btn">Выберите файл</button>
                        <button class="btn">Загрузить</button>
                    </div>
                    <div class="elementtable">
                        <div class="elementtable__head">
                            <div class="elementtable__tr elementtable__tr-1"></div>
                            <div class="elementtable__tr elementtable__tr-2"><span>Для консультантов</span>
                            </div>
                            <div class="elementtable__tr elementtable__tr-3"><span>Для клиентов</span>
                            </div>
                            <div class="elementtable__tr elementtable__tr-4"><span>Изменить порядок</span>
                            </div>
                            <div class="elementtable__tr elementtable__tr-5"></div>
                        </div>
                        <draggable
                            v-model="cat.images"
                            handle=".updown_handle"
                            @start="drag=true"
                            @end="drag=false"
                            @change="log($event, i)">
                            <div class="elementtable__row"
                                 v-for="(image, j) in orderBy(cat.images, 'sort')"
                                 :key="j">
                                <div class="elementtable__tr elementtable__tr-1">
                                    <picture>
                                        <img :src="image.src" alt="IMG">
                                    </picture>
                                </div>
                                <div class="elementtable__tr elementtable__tr-2">
                                    <input type="checkbox" name="name" v-model="image.show_client">
                                </div>
                                <div class="elementtable__tr elementtable__tr-3">
                                    <input type="checkbox" name="name" v-model="image.show_consultant">
                                </div>
                                <div class="elementtable__tr elementtable__tr-4">
                                    <div class="updown updown_handle">
                                        <div class="updown__up">
                                            <svg class="svg svg-up" width="50" height="50"
                                                 :class="{unactive: j === 0}">
                                                <use xlink:href="ico/sprite/sprite.svg#up"></use>
                                            </svg>
                                        </div>
                                        <div class="updown__down">
                                            <svg class="svg svg-down" width="50" height="50"
                                                 :class="{unactive: j === cat.images.length -1}">
                                                <use xlink:href="ico/sprite/sprite.svg#down"></use>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div class="elementtable__tr elementtable__tr-5">
                                    <button><span>Удалить</span>
                                    </button>
                                </div>
                            </div>
                        </draggable>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>
<script>


    import Vue from 'vue'
    import Vue2Filters from 'vue2-filters'
    import draggable from 'vuedraggable'

    Vue.use(Vue2Filters)
    Vue.component('draggable', draggable)


    export default {
        mixins: [Vue2Filters.mixin],
        data() {
            return {
                openMenu: false,
                menu: {
                    active: 0,
                }
            }
        },
        created() {
        },
        methods: {
            log(ev, catIndex){
                let imgs = this.$root.data.images[catIndex].images;

                imgs.forEach((img, i) => {
                    img.sort = i
                });

                this.$forceUpdate();

            },/*
            async changePosition(catIndex, imgSort, direction, swithSort = null) {


                let imgs = this.$root.data.images[catIndex].images;
                let imgSwithSort = swithSort || (direction === 'up') ? imgSort - 1 : imgSort + 1;
                let skipId = null;
                let newIndexes = [];


                imgs.forEach(img => {

                    if (img.id !== skipId && img.sort === imgSwithSort) {
                        img.sort = imgSort;
                        skipId = img.id;
                        newIndexes.push(img.sort);
                    }

                    if (img.id !== skipId && img.sort === imgSort) {
                        img.sort = imgSwithSort;
                        skipId = img.id;
                        newIndexes.push(img.sort);
                    }

                    if(img.id !== skipId){
                        newIndexes.push(img.sort);
                    }
                });

                console.log(imgs[0])
                imgs = newIndexes.map(i => imgs[i]);
                console.log(imgs[0])

                this.$forceUpdate();
            }*/
        },
        beforeRouteEnter(to, from, next) {

            next(vm => {

                vm.$root.getData('images', to.path, (err, data, query) => {
                    vm.$root.setData(err, data, query);
                    vm.$forceUpdate();
                })
            })

        }
    }
</script>
