<template>
    <div class="constructor__content">
        <div class="canvas">

            <div class="canvas__link">

                <a href="#" @click="print()" data-fancybox data-src="#generate">
                    <svg class="svg svg-download" width="50" height="50">
                        <use xlink:href="ico/sprite/sprite.svg#download"></use>
                    </svg>
                    <span>Скачать</span>
                </a>
                <a href="javascript:;" data-fancybox data-src="#copylink">
                    <svg class="svg svg-link" width="50" height="50">
                        <use xlink:href="ico/sprite/sprite.svg#link"></use>
                    </svg>
                    <span>Скопировать ссылку</span>
                </a>
                <a href="#">
                    <svg class="svg svg-share" width="50" height="50">
                        <use xlink:href="ico/sprite/sprite.svg#share"></use>
                    </svg>
                    <span>Поделиться</span>
                </a>
                <a href="#" @click="clearOptions">
                    <svg class="svg svg-share" width="50" height="50">
                        <use xlink:href="ico/sprite/sprite.svg#x"></use>
                    </svg>
                    <span>Очистить</span>
                </a>
            </div>

            <div class="canvas__block" @click="menu.open = false;">

                <div ref="printBox" class="canvas" :style="{
                    'width': this.options.size.width + 'px',
                    'height': this.options.size.height + 'px',
                    'background': (this.options.background.src) ? 'url(' + this.options.background.src + ')' : 'white',}">

                    <div class="overlayWhite"
                         :style="{'background-color': 'rgba(255, 255, 255, ' + options.background.opacity + ' )'}"></div>

                    <drr v-for="(el, i) in options.drags" ref="drrs"
                         :key="i"
                         :x="el.x"
                         :y="el.y"
                         :w="el.w"
                         :h="el.h"
                         :angle="el.angle"
                         :aspectRatio="true"
                         @select="selectDrr(i, el)"
                         @change="dragChange($event, el)">

                        <div class="dragHolder">

                            <div class="svgHolder" v-if="el.type === 'svg'">
                                <simple-svg width="100%"
                                            height="100%"
                                            :ref="'svg' + i"
                                            :style="{fill: el.color}"
                                            :src="el.src"
                                            @load="svgLoaded(i)">
                                </simple-svg>
                            </div>

                            <div class="imgHolder" v-if="el.type === 'img'">
                                <img :src="el.src" @load="imgLoaded(el)">
                            </div>

                            <div class="handle handle-mr delete" @click.prevent="$delete(options.drags, i)"
                                 @touchend.prevent="$delete(options.drags, i)"></div>

                            <div class="colorHolder" v-if="el.type === 'svg'"
                                 @touchstart.prevent="$event.target.click()">
                                <compact-picker @input="colorUpdate($event, el)" :value="el.color"></compact-picker>
                                <div @click.prevent="showColor($event)" class="handle handle-mb color"></div>
                            </div>

                        </div>

                    </drr>


                    <div class="signature" v-show="options.signature || options.pagelink">
                        <p>{{options.signature}}</p>
                        <p>{{options.pagelink}}</p>
                    </div>

                </div>
            </div>

            <div class="canvas__footer" v-show="options.products.length">
                <span>Список средств</span>
                <div v-for="(product, i) in options.products" :key="i">
                    <a :href="product.link">{{i + 1}}. {{product.name}}</a>
                </div>
            </div>

        </div>

    </div>
</template>

<script>
    import Vue from 'vue'
    import drr from '@minogin/vue-drag-resize-rotate'
    import VueSimpleSVG from 'vue-simple-svg'
    import {Compact} from 'vue-color'
    import downscale from 'downscale'
    import html2canvas from 'html2canvas';

    Vue.component('drr', drr);
    Vue.component('compact-picker', Compact);
    Vue.use(VueSimpleSVG)

    export default {
        props: ['options', 'menu', 'generate'],
        data() {
            return {
                reorder: false,
                scaleTimes: 2
            }
        },
        methods: {
            selectDrr(i) {

                this.$refs['drrs'].forEach((drr, index) => {

                    if (index !== i) {
                        drr.deselect();
                        drr.$el.style['z-index'] = 0
                    } else {
                        drr.$el.style['z-index'] = 1
                    }

                })

            },
            clearOptions() {
                this.$emit('clearOptions')
            },
            showColor(ev) {
                ev.target.closest('.dragHolder').classList.toggle('showColors')
            },
            colorUpdate(color, el) {
                el.color = color.hex;
            },
            dragChange(rect, el) {
                Object.keys(rect).forEach(key => {
                    el[key] = rect[key];
                })
            },
            svgLoaded(i) {
                if (this.reorder) {
                    this.reorder = false
                    return
                }

                let prop = this.options.drags[i];

                if (prop.x === -999) {
                    let el = this.$refs['svg' + i][0].$el;

                    prop.h = el.scrollHeight;
                    prop.w = el.scrollWidth;
                    prop.x = el.closest(".canvas").offsetWidth / 2;

                    el.style.height = '100%';
                    el.style.width = '100%';

                }
            },
            imgLoaded(props) {
                if (props.x === -999)
                    props.x = (this.$refs.printBox.clientWidth / 2) - props.w / 2;
            },
            scale(x, el) {
                el.style.transform = 'scale(' + x + ')';
            },
            async print() {
                let type = 'png';
                let name = 'image';

                this.generate.src = '';
                while (this.generate.steps.length)
                    this.$delete(this.generate.steps, 0);


                let el = this.$refs.printBox;

                //First we scale html
                this.scale(this.scaleTimes, el);

                let canvas;

                try {
                    //Html convert to canvas
                    this.generate.steps.push('Html на Canvas')
                    canvas = await html2canvas(el);
                } catch (error) {
                    this.generate.error = error;
                }

                //Canvas to DataUrl
                let imgData = canvas.toDataURL('image/' + type, 1.0);
                this.generate.steps.push('Canvas на PNG')


                //Pixel Manipulation (generate a greyscale moire pattern)
                downscale(imgData, this.options.size.width, this.options.size.height, {quality: 1, imageType: 'png'})
                    .then(dataURL => {

                        this.generate.steps.push('Улучшение качество')
                        this.generate.src = dataURL;
                        this.generate.name = name + '.' + type;

                        //Scale back to 1
                        this.scale(1, el);


                    }).catch(error => {
                    this.generate.error = error;
                });

            }
        }
    }
</script>

<style>
    .vdr {
        border: 1px solid #a4a4a4;
    }

    .drr-stick, .handle {
        width: 18px !important;
        height: 18px !important;
        background-image: url('/postcard/img/drag.jpg') !important;
        background-size: cover !important;
    }

    .handle.handle-mr, .handle.handle-mt, .handle.handle-mb {
        display: none;
        width: 22px !important;
        height: 22px !important;
        border: none;
        cursor: pointer;
        border-radius: 100%;
        z-index: 10;
    }

    .handle.handle-mr {
        margin-top: -11px;
        margin-left: 15px;
        left: 100%;
        background-image: url('/postcard/img/close.png') !important;
        position: absolute;
        top: 50%;
    }

    .drr-stick.drr-stick-ro {
        background-image: url('/postcard/img/rotate.png') !important;
        height: 22px !important;
        width: 22px !important;
        background-size: cover;
        background-color: transparent;
        -webkit-box-shadow: none;
        box-shadow: none;
        top: -38px !important;
        margin-left: -11px !important;
        border: none !important;
        border-radius: 100% !important;
    }

    .ro-stick-handle {
        display: none;
    }

    .handle.handle-mr:before, .drr-stick.drr-stick-ro:before, .handle.handle-mb:before {
        content: '';
        display: block;
        border-color: #a4a4a4;
        border-style: solid;
        border-width: 0;
    }

    .handle.handle-mr:before {
        width: 10px;
        margin-top: calc(50% - 1px);
        margin-left: -10px;
        border-bottom-width: 1px;
    }

    .drr-stick.drr-stick-ro:before {
        height: 10px;
        margin-left: calc(50% - 1px);
        margin-top: 100%;
        border-left-width: 1px;
    }

    .handle.handle-mb:before {
        height: 13px;
        margin-left: calc(50% - 1px);
        border-left-width: 1px;
        transform: translateY(-100%);
    }

    .active .handle.handle-mr, .active .handle.handle-mb {
        display: block;
    }

    .drr.active::before {
        outline: solid 1px #a4a4a4 !important;
        outline-offset: 5px;
    }

    .drr-stick-tl, .drr-stick-bl {
        margin-left: -11px !important;
    }

    .drr-stick-tr, .drr-stick-br {
        right: -11px !important;
    }

    .drr-stick-tl, .drr-stick-tr {
        margin-top: -11px !important;
    }

    .drr-stick-bl, .drr-stick-br {
        margin-bottom: -11px !important;
    }

    .vc-compact {
        width: 245px !important;
        display: none;
        margin: auto;
        position: relative;
    }

    .drr.active .showColors div .vc-compact {
        display: block;
    }

    .svgHolder .vc-compact {
        margin: auto;
        margin-top: auto;
        margin-top: 27px;

    }

    .handle.handle-mb.color {
        left: 50%;
        position: absolute;
        top: 100%;
        margin-left: -9px;
        margin-top: 18px;
        background-image: url('/postcard/img/color.jpg') !important;
        z-index: 1;
    }

    .handle:focus, .handle:active {
        opacity: .5 !important;
    }

</style>
