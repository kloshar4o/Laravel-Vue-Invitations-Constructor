<template>
<div class="VOptions">
    <div class="constructor__menu js__scroll" :class="{active : openMenu}">
        <div class="menu">

            <div class="menu__item" data-fancybox data-src="#selectsize">
                <span>Размер</span>
                <em>Для поста {{options.size.name}} <br> {{options.size.width}} x {{options.size.height}}px</em>
            </div>

            <div v-for="(menuItem, i) in [].concat(imagesData, menu.textAreas, menu.lists)" class="menu__item js__tab-btn"
                 v-if="menuItem.client || user === 'консультантов'"
                 :key="menuItem.id"
                 :ref="'menu'"
                 :class="{ 'active': menu.active === i }"
                 @click="menu.active = i">

                <span>{{menuItem.menu_name}}</span>
            </div>

        </div>

    </div>

    <div :class="classes('constructor__option')">
        <div :class="classes('options js__tab-content', cat, i)"
             v-for="(cat, i) in [].concat(imagesData, menu.textAreas ,menu.lists)"
             :key="cat.id"
             :id="i">

            <div class="options__item">

                <div class="options__title">

                    <span>{{cat.title}}</span>

                    <div class="block-range" v-show="cat.type === 'background'">
                        <label for="transparent">Прозрачность</label>
                        <input id="transparent" type="range" min="0" max="1" step="0.01"
                               v-model="options.background.opacity" :disabled="!options.background.src">
                    </div>
                </div>

                <div :class="classes('options__content', cat, i)">
                    <div :class="classes('options__content__child', cat, i)">

                        <slot v-if="cat.type === 'textAreas'" >
                            <div class="blocktextarea">
                                <textarea :name="cat.id" :placeholder="cat.menu_name" v-model="options[cat.id + 'Watch']"></textarea>
                                <span @click="options[cat.id] = ''">
                                <svg class="svg svg-x" width="50" height="50">
                                    <use xlink:href="ico/sprite/sprite.svg#x"></use>
                                </svg>
                                <em>Удалить {{cat.name}}</em>
                            </span>
                            </div>
                        </slot>

                        <slot v-else-if="cat.type === 'lists'">
                            <div class="blocktext" v-for="(product, i) in options.products" :key="i">
                                <input type="text" placeholder="Название" v-model="product.name">
                                <input type="text" placeholder="Ссылка" v-model="product.link">
                                <svg class="svg svg-x" width="50" height="50" @click="$delete(options.products, i)">
                                    <use xlink:href="ico/sprite/sprite.svg#x"></use>
                                </svg>
                            </div>

                            <div class="options__add" @click="options.products.push({name:'', link:''})">
                            <span>
                                <svg class="svg svg-plus" width="50" height="50">
                                    <use xlink:href="ico/sprite/sprite.svg#plus"></use>
                                </svg>
                            </span>
                            </div>
                        </slot>

                        <slot v-else >
                            <div :class="classes('options__content__image', cat, j, image.id)"
                                 v-if="image['show_'+$root.user]"
                                 v-for="(image, j) in orderBy(cat.images, 'sort')"
                                 :key="j"
                                 @click="setOption(cat.type, image, image.id); $emit('closeMenu')">

                                <img :src="image.src" alt="IMG">
                            </div>
                        </slot>

                    </div>
                </div>

            </div>
        </div>


    </div>

</div>
</template>

<script>
    import Vue from 'vue';
    import axios from 'axios';

    import Vue2Filters from 'vue2-filters'

    Vue.use(Vue2Filters)

    export default {
        props: ['menu', 'options',  'imagesData', 'openMenu', 'user'],
        mixins: [Vue2Filters.mixin],
        data(){
            return{
                mat:/\w{0,5}[хx]([хx\s\!@#$%\^&*+-\|\/]{0,6})[уy]([уy\s\!@#$%\^&*+-\|\/]{0,6})[ёiлeеюийя]\w{0,7}|\w{0,6}[пp]([пp\s\!@#$%\^&*+-\|\/]{0,6})[iие]([iие\s\!@#$%\^&*+-\|\/]{0,6})[3зс]([3зс\s\!@#$%\^&*+-\|\/]{0,6})[дd]\w{0,10}|[сcs][уy]([уy\!@#$%\^&*+-\|\/]{0,6})[4чkк]\w{1,3}|\w{0,4}[bб]([bб\s\!@#$%\^&*+-\|\/]{0,6})[lл]([lл\s\!@#$%\^&*+-\|\/]{0,6})[yя]\w{0,10}|\w{0,8}[её][bб][лске@eыиаa][наи@йвл]\w{0,8}|\w{0,4}[еe]([еe\s\!@#$%\^&*+-\|\/]{0,6})[бb]([бb\s\!@#$%\^&*+-\|\/]{0,6})[uу]([uу\s\!@#$%\^&*+-\|\/]{0,6})[н4ч]\w{0,4}|\w{0,4}[еeё]([еeё\s\!@#$%\^&*+-\|\/]{0,6})[бb]([бb\s\!@#$%\^&*+-\|\/]{0,6})[нn]([нn\s\!@#$%\^&*+-\|\/]{0,6})[уy]\w{0,4}|\w{0,4}[еe]([еe\s\!@#$%\^&*+-\|\/]{0,6})[бb]([бb\s\!@#$%\^&*+-\|\/]{0,6})[оoаa@]([оoаa@\s\!@#$%\^&*+-\|\/]{0,6})[тnнt]\w{0,4}|\w{0,10}[ё]([ё\!@#$%\^&*+-\|\/]{0,6})[б]\w{0,6}|\w{0,4}[pп]([pп\s\!@#$%\^&*+-\|\/]{0,6})[иeеi]([иeеi\s\!@#$%\^&*+-\|\/]{0,6})[дd]([дd\s\!@#$%\^&*+-\|\/]{0,6})[oоаa@еeиi]([oоаa@еeиi\s\!@#$%\^&*+-\|\/]{0,6})[рr]\w{0,12}/ig,
                matArray: []
            }
        },
        watch: {
            'options.signatureWatch'(text) {
                text = text.replace(this.mat, ' ');

                this.matArray.forEach(word => {
                    text = text.replace(new RegExp(word, 'g'), '');
                });

                this.options.signature = text;
            },
        },
        methods: {
            replace(){
                return this.replace(/[<>\n]/g, function(match) { // be sure to add every char in the pattern
                    return replace_map[match];
                });
            },
            classes(tagClass, cat = {}, i = 0, imageId = 0) {
                let isBg = cat.type === 'background';
                let isImg = cat.type === 'img';
                let isSvg = cat.type === 'svg';
                let classess = [tagClass];

                switch (tagClass) {
                    case 'constructor__option':
                        classess.push({
                            'active': this.openMenu
                        });
                        break;

                    case 'options js__tab-content':
                        classess.push({
                            'active': this.menu.active === i,
                            'options-background': isBg,
                        });
                        break;

                    case 'options__content':
                        classess.push({});
                        break;

                    case 'options__content__child':
                        classess.push({
                            'scrollblock--grid': isImg || isBg,
                        });
                        break;

                    case 'options__content__image':
                        classess.push([cat.folder,{
                            'svgimg__item': isSvg,
                            'background__item': isBg,
                            'scrollblock__item': isImg,
                            'active': this.options.background.active === imageId && isBg
                        }]);
                        break;
                }
                return classess;
            },
            setOption(type, image, id) {
                let app = this;
                let maxw = 200;


                let defoultValues = {
                    x: -999,
                    y: 200,
                    angle: 0,
                };

                let img = new Image();
                img.src = image.src;

                img.onload = function() {

                    let w = this.width;
                    let h = this.height;
                    let ratio = 0;


                    if(w > maxw){
                        ratio = maxw / w;
                        w = maxw;
                        h = h * ratio;
                    }

                    if(h < 100){
                        h *= 2
                        w *= 2
                    }

                    defoultValues.w = w;
                    defoultValues.h = h;


                    switch (type) {
                        case 'svg':
                        case 'img':
                            app.options.drags.push({
                                ...image,
                                ...defoultValues,
                                type: type,
                                color: {},
                            });
                            break;

                        case 'background':

                            if (id === app.options.background.active) {
                                app.options.background.active = '';
                                app.options.background.src = ''
                            } else {
                                app.options.background = {
                                    opacity: app.options.background.opacity || 0.5,
                                    src: image.src,
                                    active: image.id,
                                };
                            }
                            break;

                    }
                };


            }
        },
        created(){
             axios.get('mat.json').then(res => {
                 this.matArray = res.data;
             })
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
