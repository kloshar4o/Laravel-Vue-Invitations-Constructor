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

                    <form @submit.prevent="uploadImage($event, cat, i)" enctype="multipart/form-data">

                        <div class="elementcontent__btn">
                            <label class="btn" :for="cat.id + 'file'"> Выберите файл </label>
                            <input type="file" multiple :id="cat.id + 'file'" class="form-control"
                                   @change="onFileChange($event, cat)" style="display: none;">

                            <label class="btn" :for="cat.id + 'submit'"> Загрузить</label>
                            <input type="submit" :id="cat.id + 'submit'" style="display: none;" :disabled="!cat.files">
                        </div>

                        <div v-if="cat.files" class="files">
                            <p>Файлы для загрузки:</p>
                            <span v-for="file in cat.files">{{file.name}}</span>
                        </div>

                    </form>

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

                            tag="div"
                            v-bind="dragOptions"

                            v-model="cat.images"
                            handle=".updown_handle"
                            @start="drag=true"
                            @end="drag=false; uploadSort($event, cat.images) ">

                            <transition-group type="transition" :name="!drag ? 'flip-list' : null">

                                <div class="elementtable__row"
                                     v-for="(image, j) in orderBy(cat.images, 'sort')"
                                     :key="image.id">

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

                            </transition-group>

                        </draggable>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>
<script>


    import Vue from 'vue'
    import axios from 'axios'
    import Vue2Filters from 'vue2-filters'
    import draggable from 'vuedraggable'

    import VueToast from 'vue-toast-notification';
    import 'vue-toast-notification/dist/index.css';

    Vue.use(VueToast);
    Vue.use(Vue2Filters)
    Vue.component('draggable', draggable)

    export default {
        mixins: [Vue2Filters.mixin],
        data() {
            return {
                file: '',
                success: '',
                openMenu: false,
                drag: false,
                menu: {
                    active: 0,
                }
            }
        },
        created() {
        },
        methods: {
            uploadSort(ev, images) {
                if (ev.newIndex !== ev.oldIndex) {

                    images.forEach((img, i) => {
                        img.sort = i
                    });

                    axios
                        .post('images/sort', {
                            images: images
                        })
                        .then(res => {
                            Vue.$toast.open(res.data.message);
                        })
                        .catch(error => {

                            Vue.$toast.open({
                                message: error.toString(),
                                type: 'error',
                            });
                        });
                }
            },
            onFileChange(e, cat) {

                cat.files = e.target.files;

                this.$forceUpdate();

            },
            uploadImage(e, cat, catIndex) {

                const config = {
                    headers: {'content-type': 'multipart/form-data'}
                };

                Array.from(cat.files).forEach(file => {
                    let app = this;
                    let formData = new FormData();
                    let totalImages =  app.$root.data.images[catIndex].images.length;

                    formData.append('file', file);
                    formData.append('folder', cat.folder);
                    formData.append('cat', cat.id);
                    formData.append('sort', totalImages);

                    axios.post('/images/save', formData, config)
                        .then(function (res) {

                            Vue.$toast.open(res.data.message);
                            cat.images.push(res.data.image);
                            app.$forceUpdate();

                        })
                        .catch(function (error) {

                            Vue.$toast.open({
                                message: error.toString(),
                                type: 'error',
                            });
                        });
                })
            }
        },
        computed: {
            dragOptions() {
                return {
                    animation: 200,
                    group: "description",
                    disabled: false,
                    ghostClass: "ghost"
                };
            },
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

<!--
&lt;!&ndash; SASS styling &ndash;&gt;
<style lang="scss" scoped>
    .dropbox {
        outline: 2px dashed grey; /* the dash box */
        outline-offset: -10px;
        background: lightcyan;
        color: dimgray;
        padding: 10px 10px;
        min-height: 200px; /* minimum height */
        position: relative;
        cursor: pointer;
    }

    .input-file {
        opacity: 0; /* invisible but it's there! */
        width: 100%;
        height: 200px;
        position: absolute;
        cursor: pointer;
    }

    .dropbox:hover {
        background: lightblue; /* when mouse over to the drop zone, change color */
    }

    .dropbox p {
        font-size: 1.2em;
        text-align: center;
        padding: 50px 0;
    }
</style>-->
