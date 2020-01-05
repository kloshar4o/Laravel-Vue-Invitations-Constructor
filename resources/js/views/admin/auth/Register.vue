
<template>
    <div id="wrapper">
        <div class="login">
            <form action="#" class="formlog" autocomplete="off" @submit.prevent="register" method="post">

                <h3>Register</h3><span>Online invitations constructor</span>

                <div class="alert alert-suc" v-if="success">
                    <p>User <a :href="'mailto:'+email">{{email}}</a> successfully created, you can <router-link :to="{ name: 'Login' }">login</router-link></p>
                </div>

                <div class="form-group" v-bind:class="{ 'has-error': errors.register.name }">
                    <span class="help-block" v-if="errors.register.name" v-for="err in errors.register.name">{{ err }}</span>
                    <input type="text" id="name" class="form-control" v-model="name" placeholder="Имя">
                </div>
                <div class="form-group" v-bind:class="{ 'has-error': errors.register.email }">
                    <span class="help-block" v-if="errors.register.email" v-for="err in errors.register.email">{{ err }}</span>
                    <input type="email" id="email" class="form-control" placeholder="E-mail" v-model="email">
                </div>
                <div class="form-group" v-bind:class="{ 'has-error': errors.register.password }">
                    <span class="help-block" v-if="errors.register.password" v-for="err in errors.register.password">{{ err }}</span>
                    <input type="password" id="password" class="form-control" v-model="password" placeholder="Пароль">
                </div>

                <button type="submit">Register</button>
            </form>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                name: '',
                email: '',
                password: '',
                error: false,
                errors: {},
                success: false
            };
        },
        methods: {
            register() {
                let app = this;

                app.$root.loading = true;

                this.$auth.register({
                    data: {
                        name: app.name,
                        email: app.email,
                        password: app.password
                    },
                    success: function () {
                        app.success = true;
                        app.$root.loading = false;

                    },
                    error: function (resp) {

                        app.$root.loading = false;
                        app.error = true;
                        app.errors.register = resp.response.data.errors;
                        app.$forceUpdate()
                    }
                });
            }
        },
        created(){
            this.errors.register = this.errors.register || {};
        },
        beforeRouteLeave (to, from, next) {
            this.errors.register = false;
            next();
        }

    }
</script>
