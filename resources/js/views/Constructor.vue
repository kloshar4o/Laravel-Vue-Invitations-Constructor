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
    import axios from 'axios';
    import constructor from '../constructor/invitations.vue';

    Vue.component('constructor', constructor)

    const getImages = callback => {

        axios
            .get('/postcard/api/images')
            .then(response => {
                callback(null, response.data);
            }).catch(error => {
            callback(error, error.response.data);
        });
    };

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
            setData(err, data) {


                if (err) {
                    this.error = err.toString();
                } else {
                    this.data = {};
                    this.data.cats = data;

                }
            },
        },
        beforeRouteEnter(to, from, next) {

            getImages((err, data) => {
                next(vm => vm.setData(err, data));
            });

        },
        beforeRouteUpdate(to, from, next) {


            getUsers((err, data) => {
                this.setData(err, data);
                next();
            });
        }
    }
</script>
