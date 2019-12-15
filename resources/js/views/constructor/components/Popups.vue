<template>
    <div>

        <div class="popup selectsize" id="selectsize" ref="selectSize">
            <div class="popup__wrap">
                <h3>Выберите размер</h3>
                <div class="selectsize__grid">
                    <div class="selectsize__item js__popup-select"
                         v-for="size in menu.sizes"
                         :key="size.name"
                         :class="{'checked': (size.name === options.size.name)}"
                         @click="options.size = size">
                        <i><img :src="'img/'+size.img+'.png'" alt="IMG"/></i>
                        <b>Для поста {{size.name}}</b><em>{{size.width}} x {{size.height}}px</em>
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
        props: ['options', 'menu', 'generate'],
        methods: {
        },
        created() {

            //hamburger menu init
            $(".js__open-menu").click(function() {
                [
                    $(this).find(".hamburger"),
                    $(".constructor__menu"),
                    $(".constructor__option"),

                ].forEach(function (el) {
                    el.toggleClass("active");
                })
            });

            $.fancybox.defaults.touch = false;
        },

    }
</script>
