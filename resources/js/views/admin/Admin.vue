<template>
    <div>
        <header class="header header-admin">
            <div class="header__wrap">
                <div class="header__menubtn js__open-menu">
                    <div class="hamburger" @click="menu = !menu;" :class="{active: menu}"><span></span>
                    </div>
                </div>
                <div class="header__logo"><b>Dashboard</b> <span>
                    <router-link :to="{ name: 'Constructor', params: {user: 'consultant'} }">Online invitations editor</router-link></span>
                </div>
                <div class="header__text link">
                    <a href="#" @click="goTo('consultant')">Consultant invitations</a>
                    <a href="#" @click="goTo('client')">Client invitations</a>
                </div>
                <div class="header__link"><a href="#" @click.prevent="$auth.logout()" v-if="$auth.check()">Logout</a>
                </div>
            </div>
        </header>


        <div id="wrapper" @click="menu = false">
            <div class="constructor__menu js__scroll" :class="{active: menu}">
                <div class="menu">
                    <div v-for="(menuItem, i) in $root.data.images" class="menu__item js__tab-btn"
                         :key="menuItem.id"
                         :ref="'menu'"
                         :class="{ 'active': page === menuItem.folder }"
                         @click="goTo(menuItem.folder)">

                        <span>{{menuItem.menu_name}}</span>
                    </div>
                </div>
            </div>

            <div class="constructor__admin"
                 v-for="(cat, i) in $root.data.images"
                 :class="{ 'active': page === cat.folder }"
                 :key="cat.id"
                 :id="i">
                <div class="admincontent elementcontent">
                    <h3>{{cat.menu_name}}</h3>

                    <UploadForm :cat="cat" @upload="ImagesTableKey++" :index="i"></UploadForm>

                    <ImagesTable :cat="cat" :menuOpen="menu" :key="ImagesTableKey"></ImagesTable>

                </div>
            </div>

            <CardsTable :page="page" @updatedParamas="updatedParamas"></CardsTable>

        </div>
    </div>
</template>
<script>
    import UploadForm from './components/imagesUpload.vue';
    import ImagesTable from './components/imagesTable.vue';
    import CardsTable from './components/cardsTable.vue';

    export default {
        components: {UploadForm, ImagesTable, CardsTable},
        data() {
            return {
                ImagesTableKey: 1,
                page: this.$router.currentRoute.params.page,
                menu: false,
                params: {
                    client: { page: 1},
                    consultant: { page: 1},
                },
            }
        },
        methods: {
            updatedParamas({page, params}){
                this.params[page] = params;
            },
            goTo(page){

                if(page !== this.page){

                    this.$router.push({path: page, query: this.params[page]} );
                    this.$root.adminPage = page;
                    this.page = page;
                }
            },
        },
        beforeRouteEnter(to, from, next) {

            next(vm => {
                vm.$root.setRootData('images', () => {
                    vm.$forceUpdate()
                    vm.$root.loading = false;
                })
            })
        },

    }
</script>
