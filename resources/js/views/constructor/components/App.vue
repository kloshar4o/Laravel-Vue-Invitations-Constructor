<template>


    <div id="wrapper" v-if="images && options && !$root.loading">

        <VOptions
            v-if="options"
            :options="options"
            :lists="lists"
            :textAreas="textAreas"
            :imagesData="images"
            :openMenu="openMenu"
            :userType="userType"
            @closeMenu="$emit('closeMenu')">

        </VOptions>


        <div class="constructor__content">
            <div class="canvas">

                <div class="canvas__block" @click="$emit('closeMenu')">

                    <VContentButtons :options="options" :generate="generate" :userType="userType" @clearOptions="clearOptions"></VContentButtons>

                    <VContent :options="options" ref="content" @closeMenu="$emit('closeMenu')"></VContent>

                </div>
            </div>
        </div>

        <VPopups :options="options" :sizes="sizes" :generate="generate"></VPopups>

    </div>

</template>


<script>
    import Vue from 'vue'

    import VOptions from './Options.vue'
    import VPopups from './Popups.vue'

    import VContent from './content/Content.vue'
    import VContentButtons from './content/ContentButtons.vue'

    import VueCookies from 'vue-cookies'
    Vue.use(VueCookies);

    export default {
        name: 'constructor',
        props: ['user', 'userType', 'openMenu', 'textAreas', 'lists', 'options', 'images', 'sizes'],
        components: {VOptions, VPopups, VContent, VContentButtons},
        data() {
            return {
                generate: {
                    src: '',
                    name: '',
                    steps: []
                },
                menu: {
                    active: 0,
                    textAreas: this.textAreas,
                    lists: this.lists,
                }
            }
        },
        methods: {
            clearOptions() {
                VueCookies.set('options', '');
                this.$emit('initOptions')
            },
        },

    }
</script>
