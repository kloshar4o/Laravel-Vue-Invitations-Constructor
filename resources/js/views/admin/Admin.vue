<template>
    <div>
        <header class="header header-admin">
            <div class="header__wrap">
                <div class="header__menubtn js__open-menu">
                    <div class="hamburger" @click="menu.open = !menu.open;" :class="{active: menu.open}"><span></span>
                    </div>
                </div>
                <div class="header__logo"><b>Режим администратора</b> <span>
                    <router-link :to="{ name: 'Constructor' }">Онлайн-редактор</router-link> открыток</span>
                </div>
                <div class="header__text link"><a href="#">Открытки консультантов</a> <a href="#">Открытки клиентов</a>
                </div>
                <div class="header__link"><a href="#" @click.prevent="$auth.logout()" v-if="$auth.check()">Выйти</a>
                </div>
            </div>
        </header>


        <div id="wrapper" @click="menu.open = false">
            <div class="constructor__menu js__scroll" :class="{active: menu.open}">
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
                    <h3>{{cat.menu_name}}</h3>

                    <UploadForm :cat="cat" @upload="$forceUpdate()" :index="i"></UploadForm>

                    <ImagesTable :cat="cat" :menuOpen="menu.open" ></ImagesTable>

                </div>
            </div>

        </div>
    </div>
</template>
<script>
    import UploadForm from './components/imagesUpload.vue';
    import ImagesTable from './components/imagesTable.vue';

    export default {
        components: {UploadForm, ImagesTable},
        data() {
            return {
                menu: {
                    open: false,
                    active: 0,
                }
            }
        },
        beforeRouteEnter(to, from, next) {

            next(vm => {

                vm.$root.getData('images', to.path, (err, data, query) => {
                    vm.$root.setData(err, data, query);
                    vm.$forceUpdate();
                })
            })

        },
    }
</script>
