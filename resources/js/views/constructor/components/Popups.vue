<template>
    <div>

        <div class="popup selectsize" id="selectsize" ref="selectSize">
            <div class="popup__wrap">
                <h3>Select image size</h3>
                <div class="selectsize__grid">
                    <div class="selectsize__item js__popup-select"
                         v-for="size in sizes"
                         :key="size.name"
                         :class="{'checked': (size.name === options.size.name)}"
                         @click="options.size = size">
                        <i><img :src="size.img" alt="IMG"/></i>
                        <b>{{size.name}}</b><em>{{size.width}} x {{size.height}}px</em>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>


<script>
    import JQuery from 'jquery'
    let $ = JQuery;
    window.jQuery = $;
    require("@fancyapps/fancybox");

    export default {
        props: ['options', 'sizes'],
        methods: {
        },
        created() {

            //hamburger menu init

            $.fancybox.defaults.touch = false;
        },

    }
</script>
