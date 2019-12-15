<template>


    <div id="wrapper" v-if="imagesData && options && !$root.loading">

        <VOptions :menu="menu" :imagesData="imagesData" :options="options" :openMenu="openMenu"
                  @closeMenu="$emit('closeMenu')"></VOptions>


        <div class="constructor__content">
            <div class="canvas">

                <div class="canvas__block" @click="$emit('closeMenu')">

                    <VContentButtons :options="options" @clearOptions="clearOptions" :generate="generate"></VContentButtons>

                    <VContent :options="options" :menu="menu" @closeMenu="$emit('closeMenu')" ref="content"></VContent>

                    <div class="canvas__footer" v-show="options.products.length">
                        <span>Список средств</span>
                        <div v-for="(product, i) in options.products" :key="i">
                            <a :href="product.link">{{i + 1}}. {{product.name}}</a>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <VPopups :options="options" :menu="menu" :generate="generate"></VPopups>

    </div>

    <p v-else=""> No images provided..</p>

</template>


<script>
    import Vue from 'vue'
    import VueCookies from 'vue-cookies'

    import VOptions from './Options.vue'
    import VPopups from './Popups.vue'

    import VContent from './content/Content.vue'
    import VContentButtons from './content/ContentButtons.vue'

    Vue.use(VueCookies)
    export default {
        name: 'constructor',
        props: ['imagesData', 'textAreas', 'sizes', 'lists', 'options', 'openMenu'],
        components: {VOptions, VContent, VPopups, VContentButtons},
        watch: {
            'options': {
                handler(val) {
                    VueCookies.set('options', val);
                },
                deep: true
            }
        },
        data() {
            return {
                generate: {
                    steps: [],
                    src: '',
                    name: ''
                },
                menu: {
                    open: false,
                    active: 0,
                    sizes: this.sizes,
                    textAreas: this.textAreas,
                    lists: this.lists,
                }
            }
        },
        methods: {
            clearOptions() {
                VueCookies.set('options', '');
                this.initOptions();
            },
            initOptions() {
                let options = VueCookies.get('options') || {
                    size: this.menu.sizes[0],
                    colors: [],
                    drags: [],
                    background: {},
                    signature: '',
                    link: '',
                    products: [],
                    activeImages: [],
                }
                this.$emit('optionsUpdated', options)
            },
        },
        created() {
            if (!this.options) {
                this.initOptions();
            }
        }

    }
</script>
