<template>

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

                        <slot v-if="cat.type === 'textAreas'">
                            <div class="blocktextarea">
                                <textarea :name="cat.id" :placeholder="cat.menu_name" v-model="options[cat.id]"></textarea>
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
                                <input type="text" placeholder="Название" v-model="product.menu_name">
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

                        <slot else="">
                            <div :class="classes('options__content__image', cat, j)"
                                 v-for="(image, j) in cat.images"
                                 :key="j"
                                 @click="setOption(cat.type, image, j)">

                                <img :src="image.src" alt="IMG">
                            </div>
                        </slot>

                    </div>
                </div>

            </div>
        </div>


    </div>

</template>

<script>


    export default {
        props: ['imagesData', 'options', 'menu'],
        methods: {
            classes(tagClass, cat = {}, i = 0) {
                let isBg = cat.type === 'background';
                let isImg = cat.type === 'img';
                let isSvg = cat.type === 'svg';
                let classess = [tagClass];

                switch (tagClass) {
                    case 'constructor__option':
                        classess.push({
                            'active': this.menu.open
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
                            'active': this.options.background.active === i && isBg
                        }]);
                        break;
                }
                return classess;
            },
            setOption(type, image, j) {
                let _this = this;

                let defoultValues = {
                    x: -999,
                    y: 200,
                    angle: 0,
                };

                let img = new Image();
                img.src = image.src;

                img.onload = function() {

                    let maxw = 200;
                    let w = this.width;
                    let h = this.height;
                    let ratio = 0;

                    if(w > maxw){
                        ratio = maxw / w;
                        w = maxw;
                        h = h * ratio;
                    }

                    defoultValues.w = w;
                    defoultValues.h = h;


                    switch (type) {
                        case 'svg':
                        case 'img':
                            _this.options.drags.push({
                                ...image,
                                ...defoultValues,
                                type: type,
                                color: {},
                            });
                            break;

                        case 'background':

                            if (j === _this.options.background.active) {
                                _this.options.background.active = '';
                                _this.options.background.src = ''
                            } else {
                                _this.options.background = {
                                    opacity: _this.options.background.opacity || 0.5,
                                    src: image.src,
                                    active: j
                                };
                            }
                            break;

                    }
                };


            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
