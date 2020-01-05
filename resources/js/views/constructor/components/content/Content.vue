<template>
    <div>

        <div ref="printBox" class="canvas" :style="{
                    'width': options.size.width + 'px',
                    'height': options.size.height + 'px',
                    'background': (options.background.src) ? 'url(\'' + options.background.src + '\')' : 'white',}">

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

                    <div v-if="el.type === 'svg'" class="svgHolder">
                        <simple-svg width="100%"
                                    height="100%"
                                    :ref="'svg' + i"
                                    :style="{fill: el.color}"
                                    :src="el.src"
                                    @load="svgLoaded(i)">
                        </simple-svg>
                    </div>

                    <div v-if="el.type === 'img'" class="imgHolder">
                        <img :src="el.src" @load="imgLoaded(el)">
                    </div>

                    <div class="handle handle-mr delete" @click.prevent="$delete(options.drags, i)"
                         @touchend.prevent="$delete(options.drags, i)"></div>

                    <div v-if="el.type === 'svg'" class="colorHolder"
                         @touchstart.prevent="$event.target.click()">
                        <Compact @input="colorUpdate($event, el)" :value="el.color"></Compact>
                        <div @click.prevent="showColor($event)" class="handle handle-mb color"></div>
                    </div>

                </div>

            </drr>


            <div class="signature" v-show="options.signature || options.pagelink">
                <p>{{options.signature}}</p>
                <p>{{options.pagelink}}</p>
            </div>

        </div>

        <div class="canvas__footer" v-show="options.products.length">
            <span>Products list</span>
            <div v-for="(product, i) in options.products" :key="i">
                <a :href="product.link" target="_blank">{{i + 1}}. {{product.name}}</a>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import drr from '@minogin/vue-drag-resize-rotate'
    import VueSimpleSVG from 'vue-simple-svg'
    import {Compact} from 'vue-color'


    export default {
        props: ['options'],
        components: {drr, Compact, VueSimpleSVG},
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

                let prop = this.options.drags[i];
                let el = this.$refs['svg' + i][0].$el;
                el.style.fill = prop.color;

                if (prop.x === -999) { //default -999

                    prop.h = el.scrollHeight;
                    prop.w = el.scrollWidth;
                    prop.x = el.closest(".canvas").offsetWidth / 2;

                    el.style.height = '100%';
                    el.style.width = '100%';

                }
            },
            imgLoaded(props) {
                if (props.x === -999) //default -999
                    props.x = (this.$refs.printBox.clientWidth / 2) - props.w / 2;
            }
        },
    }
</script>

