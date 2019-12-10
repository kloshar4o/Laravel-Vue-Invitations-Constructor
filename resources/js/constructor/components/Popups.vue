<template>
    <div>

        <div class="popup generate" id="generate">
            <div class="popup__wrap">
                <div class="copylink__wrap">
                    <h2><span>Сохранение изображения</span></h2>

                    <!--
                    <ul>
                       <ol v-for="(step, i) in generate.steps" :key="i" :style="{width: 100 / 3 + '%'}">
                           <img src="ico/check.svg" alt="IMG"><p>{{i+1}}. {{step}}</p>
                       </ol>
                    </ul>
                    -->

                    <a v-if="generate.src" target="_blank" :download="generate.name" :href="generate.src" class="bigbtn fancybox-button"><span>Скачать</span></a>
                    <div class="progressBar">
                        <span :style="{width: (generate.steps.length * 100 / 3) + '%'}"></span>
                    </div>

                    <p class="error">{{generate.error}}</p>

                    <div v-if="generate.src" >
                        <img v-if="generate.src" :src="generate.src" alt="" class="blink_me">
                    </div>

                </div>
            </div>
        </div>

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

        <div class="popup copylink" id="copylink">
            <div class="popup__wrap">
                <div class="copylink__wrap">
                    <h2><img src="ico/check.svg" alt="IMG"> <span>Ссылка скопирована</span></h2>
                    <em>Ваша открытка доступна по уникальной ссылке</em>
                    <span>http://site.ru/postcard/consultant/tg14973.html</span>
                    <button class="bigbtn" data-fancybox-close><span>OK</span>
                    </button>
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