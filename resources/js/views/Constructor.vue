<template>


    <constructor

        :imagesData="$root.data.images"
        :textAreas="textAreas"
        :sizes="sizes"
        :options="options"
        :lists="lists"
        @optionsUpdated="updateOptions">

    </constructor>


</template>


<script>
    import Vue from 'vue';
    import constructor from './constructor/app';

    Vue.component('constructor', constructor)

    export default {
        data() {
            return {
                error: null,
                options: null,
                lists: [
                    {menu_name: 'Список средств', title: 'Список средств', type: 'lists', id: 'listoffunds'}
                ],
                textAreas: [
                    {menu_name: 'Подпись', title: 'Подпись', type: 'textAreas', id: 'signature'},
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
        },
        beforeRouteEnter(to, from, next) {
            const user = to.params.user;

            console.log(to)
            if (user === 'client' || user === 'consultant' || !user) {
                next(vm => {
                    vm.$root.getData('images', to.path, (err, data, query) => {
                        vm.$root.setData(err, data, query);
                        vm.$forceUpdate();
                    })
                })
            } else {
                next(vm => {
                    vm.$router.push({name: '404'});
                })
            }
        }
    }
</script>
