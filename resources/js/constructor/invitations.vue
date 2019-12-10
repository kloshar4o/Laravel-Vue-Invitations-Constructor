<template>



        <div id="wrapper" v-if="images && options" >

            <VOptionsMenu :menu="menu" :data="images" :options="options"></VOptionsMenu>

            <VOptions :menu="menu" :data="images" :options="options"></VOptions>

            <VContent :options="options" :menu="menu" :generate="generate" @clearOptions="clearOptions"></VContent>

            <VPopups :options="options" :menu="menu" :generate="generate"></VPopups>

        </div>

        <p v-else=""> No images provided..</p>

</template>


<script>
    import Vue from 'vue'
    import VueCookies from 'vue-cookies'

    import VOptionsMenu from './components/OptionsMenu.vue'
    import VOptions from './components/Options.vue'
    import VContent from './components/Content.vue'
    import VPopups from './components/Popups.vue'



    Vue.use(VueCookies)
    export default {
        name: 'app',
        props: ['images', 'textAreas', 'sizes', 'lists', 'options'],
        components: {  VOptions, VOptionsMenu, VContent, VPopups },
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
                menu : {
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
            if(!this.options){
                this.initOptions();
            }
        }

    }
</script>
