<template>

    <constructor
        :images="data"
        :textAreas="textAreas"
        :sizes="sizes"
        :options="options"
        :lists="lists"
        @optionsUpdated="updateOptions">

    </constructor>

</template>


<script>
    import Vue from 'vue';
    import constructor from 'invitations_constructor';

    Vue.component('constructor', constructor)

    export default {
        data() {
            return {
                options: null,
                data: null,
                open: false,
                lists: [
                    {menu_name: 'Список средств', title: 'Список средств', type:'lists', id: 'listoffunds'}
                ],
                textAreas: [
                    {menu_name: 'Подпись',            title: 'Подпись',            type: 'textAreas', id: 'signature'},
                    {menu_name: 'Ссылка на страницу', title: 'Ссылка на страницу', type: 'textAreas', id: 'pagelink'},
                ],
                sizes: [
                    {img: 'facebook', name: 'Facebook', width: 1200, height: 630},
                    {img: 'insagram', name: 'Instagram', width: 1080, height: 1080},
                    {img: 'insagram', name: 'Instagram Stories', width: 1080, height: 1920},
                    {img: 'vk', name: 'Вконтакте', width: 1200, height: 630},
                    {img: 'ok', name: 'OK.ru', width: 1680, height: 1680},
                    {img: 'tw', name: 'Twitter', width: 1024, height: 512},
                ],

            }
        },
        methods: {
            updateOptions(options) {
                this.options = options
            },
            fetchData() {
                this.data = {
                    cats: [
                        {
                            id: 1,
                            menu_name: 'Заголовок',
                            title: 'ВЫБЕРИТЕ ЗАГОЛОВОК',
                            type: 'svg',
                            images: [
                                {id: 1, src: 'img/headers/micro-party.svg',},
                                {id: 2, src: 'img/headers/pozdravlyayu.svg',},
                                {id: 3, src: 'img/headers/spasibo.svg',},
                                {id: 4, src: 'img/headers/spasibo-za-zakaz.svg',},
                            ]
                        }, {
                            id: 2,
                            menu_name: 'Фон',
                            title: 'Выберите фон',
                            type: 'background',
                            images: [
                                {id: 1, src: 'img/background/01.jpg'},
                                {id: 2, src: 'img/background/02.jpg'},
                                {id: 3, src: 'img/background/03.jpg'},
                                {id: 4, src: 'img/background/04.jpg'},
                            ]
                        }, {
                            id: 3,
                            menu_name: 'Элементы',
                            title: 'Выберите элементы',
                            type: 'img',
                            images: [
                                {id: 1, src: 'img/elements/01.png'},
                                {id: 2, src: 'img/elements/02.png'},
                                {id: 3, src: 'img/elements/03.png'},
                                {id: 4, src: 'img/elements/04.png'},
                                {id: 5, src: 'img/elements/05.png'},
                            ]
                        }, {
                            id: 4,
                            menu_name: 'Стикеры',
                            title: 'Выберите стикеры',
                            type: 'img',
                            images: [
                                {id: 1, src: 'img/stickers/01.png'},
                                {id: 3, src: 'img/stickers/03.png'},
                                {id: 4, src: 'img/stickers/04.png'},
                                {id: 5, src: 'img/stickers/05.png'},
                            ]
                        },
                    ],
                }

                console.log(this.data)
            }
        },
        created() {
            this.fetchData();
        }
    }
</script>
