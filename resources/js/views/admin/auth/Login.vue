<template>
    <div id="wrapper">
        <div class="login">
            <form action="#" class="formlog" autocomplete="off" @submit.prevent="login" method="post">


                <h3>Administrator</h3>
                <span>
                    <router-link :to="{ name: 'Constructor' }">Online invitations editor</router-link>
                </span>


                <div class="alert alert-danger" v-if="error">
                    <p>Auth error, wrong login or password</p>
                </div>

                <input type="email" id="email" class="form-control" placeholder="E-mail" v-model="email" required>
                <input type="password" id="password" class="form-control" v-model="password" placeholder="Password" required>

                <button type="submit">Login</button>
                <br><br>
            </form>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                email: null,
                password: null,
                error: false
            }
        },
        methods: {
            login() {
                let app = this;
                app.$root.loading = true;
                this.$auth.login({
                    params: {
                        email: app.email,
                        password: app.password
                    },
                    success: function (res) {

                        app.$root.loading = false;
                    },
                    error: function (res) {
                        console.log(res)
                        app.error = true;
                        app.$root.loading = false;
                        app.$forceUpdate();

                    },
                    rememberMe: true,
                    redirect: {name: 'Admin', params: {page: 'client'}},
                    fetchUser: true,
                });
            },
        }

    }
</script>
