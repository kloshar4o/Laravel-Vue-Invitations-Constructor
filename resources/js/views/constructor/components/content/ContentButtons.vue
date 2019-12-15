<template>
    <div class="canvas__link">

        <a href="#" @click="print()" data-fancybox data-src="#generate">
            <svg class="svg svg-download" width="50" height="50">
                <use xlink:href="ico/sprite/sprite.svg#download"></use>
            </svg>
            <span>Скачать</span>
        </a>
        <a href="javascript:;"
           v-clipboard:copy="link"
           v-clipboard:success="onCopy"
           v-clipboard:error="errorCopy">

            <svg class="svg svg-link" width="50" height="50">
                <use xlink:href="ico/sprite/sprite.svg#link"></use>
            </svg>
            <span>Скопировать ссылку</span>
        </a>
        <a href="#" @click="updateCard('shared')">
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


        <div class="popup copylink" id="copylink">
            <div class="popup__wrap">
                <div class="copylink__wrap">
                    <h2><img src="ico/check.svg" alt="IMG"> <span>{{copyText}}</span></h2>
                    <em>Ваша открытка доступна по уникальной ссылке.</em>
                    <span>{{link}}</span>
                    <button class="bigbtn" data-fancybox-close><span>OK</span>
                    </button>
                </div>
            </div>
        </div>

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

                    <a v-if="generate.src"  :download="generate.name" :href="generate.src" @click="updateCard('downloaded')"
                       class="bigbtn fancybox-button"><span>Скачать</span></a>
                    <div class="progressBar">
                        <span :style="{width: (generate.steps.length * 100 / 3) + '%'}"></span>
                    </div>

                    <p class="error">{{generate.error}}</p>

                    <div v-if="generate.src">
                        <img v-if="generate.src" :src="generate.src" alt="" class="blink_me">
                    </div>

                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import Vue from 'vue'
    import downscale from 'downscale'
    import html2canvas from 'html2canvas';
    import axios from 'axios';

    import VueClipboard from 'vue-clipboard2'
    import fancybox from '@fancyapps/fancybox'

    Vue.use(VueClipboard)

    import JQuery from 'jquery'

    let $ = JQuery;
    window.jQuery = $;

    export default {
        props: ['generate', 'options'],
        data() {
            return {
                scaleTimes: 2,
                copyText: 'Сылка создана',

                origin: window.location.origin,
                path: window.location.pathname,
                link: null,
                name: null,
                cardId: null,
                downloaded: 0,
                shared: 0,

            }
        },
        methods: {
            generateLink() {
                return `${this.origin}${this.path}/${this.name}`
            },
            generateName() {

                let string = '';

                for (let i = 0; i < 2; i++) {
                    let chars = 'abcdefghijklmnopqrstuvwxyz';
                    let randomIndex = Math.floor(Math.random() * chars.length);
                    let randomChar = chars.charAt(randomIndex);

                    string += randomChar;
                }

                let number = Math.floor(Math.random() * Math.floor(100000))

                return string + number
            },
            onCopy() {
                this.copyText = 'Ссылка скопирована';
                $.fancybox.open($('#copylink'));
                this.sendData()
            },
            errorCopy() {
                $.fancybox.open($('#copylink'));
                this.sendData()
            },
            updateCard(stats) {
                if(this.cardId){
                    this[stats] = 1;
                    this.sendData();
                }
            },
            sendData(){
                let app = this;
                axios.post('cards/store',
                    {
                        id: app.cardId,
                        name: app.name,
                        user: app.$root.user,
                        downloaded: app.downloaded,
                        shared: app.shared,
                        data: app.options
                    })
                    .then(res => {

                        //Vue.$toast.open(res.data.toast);
                        app.cardId = res.data.id;

                    })
                    .catch(err => {
                        app.name = app.generateName()
                        Vue.$toast.open({
                            message: err.toString(),
                            type: 'error',
                        });
                    })
            },
            clearOptions() {
                this.cardId= null;
                this.name = this.generateName();
                this.link = this.generateLink();
                this.downloaded= 0;
                this.shared= 0;
                this.$emit('clearOptions')
            },
            async print() {
                let type = 'png';
                let name = this.name;
                let generate = this.generate;

                let BoxComponent = this.$parent.$refs.content
                let box = BoxComponent.$refs.printBox;
                box.parentElement.style.opacity = 0;

                const scaleBox = x => box.style.transform = 'scale(' + x + ')';

                generate.src = '';

                //clear generate
                while (generate.steps.length)
                    this.$delete(generate.steps, 0);


                //First we scale html
                scaleBox(this.scaleTimes);

                let canvas;

                try {
                    //Html convert to canvas
                    generate.steps.push('Html на Canvas')
                    canvas = await html2canvas(box);
                } catch (error) {
                    generate.error = error;
                }

                //Canvas to DataUrl
                let imgData = canvas.toDataURL('image/' + type, 1.0);

                generate.steps.push('Canvas на PNG')


                let size = this.options.size;
                //Pixel Manipulation (generate a greyscale moire pattern)
                downscale(imgData, size.width, size.height, {quality: 1, imageType: 'png'})
                    .then(dataURL => {

                        generate.steps.push('Улучшение качество')
                        generate.src = dataURL;
                        generate.name = name + '.' + type;

                        //Scale back to 1
                        scaleBox(1);
                        box.parentElement.style.opacity = 1;

                    })
                    .catch(error => {
                        generate.error = error;
                    });

            }
        },
        mounted() {
            this.name = this.generateName();
            this.link = this.generateLink()
        }
    }
</script>

