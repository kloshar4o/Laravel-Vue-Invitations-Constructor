<template>

    <div class="constructor__admin" :class="{active: isActive()}">
        <div class="admincontent" v-if="cards[page]">
            <h3>Открытки консультантов</h3>
            <span>Всего создано: {{cards[page].total}} </span><span>Их них скачано: {{cards[page].downloaded}}, поделиться ссылкой: {{cards[page].shared}}</span>


            <div class="pagination" v-if="cards[page].last_page > 1">

                <span v-for="pag in cards[page].last_page">

                    <a href="#" v-if="cards[page].current_page !== pag"
                       @click.prevent="paginateTo(page, pag)">{{pag}}</a>
                    <span v-else>{{pag}}</span>

                </span>

            </div>

            <div class="listtable">

                <div class="listtable__row" v-for="card in cards[page].data">
                    <span>{{card.id}}</span>
                    <router-link :to="toSingle(card.user, card.name)" v-slot="{href}">
                        <a :href="href"> {{domain}}{{href}}</a>
                    </router-link>
                    <em>{{formatDate(card.created_at)}}</em>

                    <button @click="destroy(card.id, page, cards[page].current_page)">Удалить</button>

                </div>

            </div>
        </div>
    </div>


</template>

<script>
    import Vue from 'vue';
    import axios from 'axios';
    import moment from 'moment';


    import VueToast from 'vue-toast-notification';
    import 'vue-toast-notification/dist/index.css';

    Vue.use(VueToast);

    export default {
        props: ['page'],
        data() {
            return {
                domain: window.location.origin,
                type: null,
                cards: {},
            }
        },

        methods: {
            destroy(id, page, currPag) {

                this.$root.loading = true;

                axios.post('cards/destroy/' + id)
                    .then(res => {
                        this.paginateTo(page, currPag)
                    })
                    .catch(err => {

                        Vue.$toast.error(err.toString());
                    })
                    .finally(() => {
                    })

            },
            formatDate(date) {
                if (date) {
                    return moment(String(date)).format('DD.MM.YYYY')
                }
            },
            paginateTo(page, pag) {

                let params = {page: pag};
                this.$router.push({query: params});
                this.$emit('updatedParamas', {page: page, params: params});
                this.fetchCards(page, params)

            },
            toSingle(user, name) {
                return {
                    name: 'Single',
                    params: {
                        user: user,
                        cardName: name
                    }
                }
            },
            isActive() {
                let pageChanged = this.type !== this.page;
                let notLoaded = !this.cards[this.page];

                switch (this.page) {
                    case 'client':
                    case 'consultant':
                        if (pageChanged && notLoaded)
                            this.fetchCards(this.page, this.$route.query);
                        return true
                }
            },
            fetchCards(type, params = {}) {

                this.$root.loading = true;

                axios.get('cards/' + type, {params: params})
                    .then(res => {
                        this.cards[type] = res.data;
                        this.$forceUpdate()
                    })
                    .catch(err => {

                        Vue.$toast.error(err.toString());
                    })
                    .finally(() => {
                        this.$root.loading = false;
                    })


            }
        },
        created() {
        },
    }
</script>
