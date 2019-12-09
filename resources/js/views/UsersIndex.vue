<template>
    <div class="users">

        <div v-if="error" class="error">
            {{ error }}


            <button @click.prevent="refresh()">
                Try Again
            </button>

        </div>

        <button @click.prevent="refresh()">refresh</button>

        <ul v-if="users">
            <li v-for="{ name, email } in users">
                <strong>Name:</strong> {{ name }},
                <strong>Email:</strong> {{ email }}
            </li>
        </ul>

        <button :disabled="! prevPage" @click.prevent="pagination(prevPage)">Previous</button>
        <pagination :data="meta" @pagination-change-page="pagination"></pagination>
        <button :disabled="! nextPage" @click.prevent="pagination(nextPage)">Next</button>

    </div>
</template>
<script>
    import Vue from 'vue';
    import axios from 'axios';

    Vue.component('pagination', require('laravel-vue-pagination'));

    const getUsers = (page, callback) => {
        const params = {page};

        axios
            .get('/api/users', {params})
            .then(response => {
                callback(null, response.data);
            }).catch(error => {
            callback(error, error.response.data);
        });
    };

    export default {
        data() {
            return {
                users: [],
                meta: {},
                error: null,
            };
        },
        computed: {

            nextPage() {
                if (!this.meta || this.meta.current_page === this.meta.last_page) {
                    return;
                }

                return this.meta.current_page + 1;
            },
            prevPage() {
                if (!this.meta || this.meta.current_page === 1) {
                    return;
                }

                return this.meta.current_page - 1;
            },
        },
        methods: {
            pagination(page = 1) {
;
                this.$router.push({
                    name: 'users.index',
                    params: { page: page}
                })
            },
            refresh() {
                let params = {page: this.meta.current_page};

                axios.get('/api/users', {params})
                    .then(({data: {data: users}}) => {
                        this.users = users;
                    }).catch(error => {
                    this.error = error.response.data.message || error.message;
                });
            },
            setData(err, {data: users, links, meta}) {


                if (err) {
                    this.error = err.toString();
                } else {
                    this.users = users;
                    this.links = links;
                    this.meta = meta;
                }
            },
        },
        beforeRouteEnter(to, from, next) {

            getUsers(to.params.page, (err, data) => {
                next(vm => vm.setData(err, data));
            });

        },
        beforeRouteUpdate(to, from, next) {


            getUsers(to.params.page, (err, data) => {
                this.setData(err, data);
                next();
            });
        },
    }
</script>
