
<template>
    <div id="wrapper">
        <div class="login">
            <form action="#" class="formlog" autocomplete="off" @submit.prevent="register" method="post">


                <h3>Регистрация</h3><span>Онлайн-редактор открыток </span>

                <div class="form-group" v-bind:class="{ 'has-error': $root.errors.register.name }">
                    <span class="help-block" v-if="$root.errors.register.name" v-for="err in $root.errors.register.name">{{ err }}</span>
                    <input type="text" id="name" class="form-control" v-model="name" placeholder="Имя">
                </div>
                <div class="form-group" v-bind:class="{ 'has-error': $root.errors.register.email }">
                    <span class="help-block" v-if="$root.errors.register.email" v-for="err in $root.errors.register.email">{{ err }}</span>
                    <input type="email" id="email" class="form-control" placeholder="E-mail" v-model="email">
                </div>
                <div class="form-group" v-bind:class="{ 'has-error': $root.errors.register.password }">
                    <span class="help-block" v-if="$root.errors.register.password" v-for="err in $root.errors.register.password">{{ err }}</span>
                    <input type="password" id="password" class="form-control" v-model="password" placeholder="Пароль">
                </div>

                <button type="submit">Регистрация</button>
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

                        this.$auth.login({
                            params: {
                                email: app.email,
                                password: app.password
                            },
                            success: function () {
                            },
                            error: function () {
                            },
                            rememberMe: true,
                            redirect: {name : 'Admin'},
                            fetchUser: true,
                        });
                    },
                    error: function (resp) {
                        console.log(resp.response.data.errors)
                        app.$root.loading = false;
                        app.error = true;
                        app.$root.errors.register = resp.response.data.errors;
                    },
                    redirect: null
                });
            }
        },
        created(){
            this.$root.errors.register = this.$root.errors.register || {};
        },
        beforeRouteLeave (to, from, next) {
            this.$root.errors.register = false;
            next();
        }

    }
</script>
