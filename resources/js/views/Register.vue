
<template>
    <div id="wrapper">
        <div class="login">
            <form action="#" class="formlog" autocomplete="off" @submit.prevent="register" method="post">


                <h3>Регистрация</h3><span>Онлайн-редактор открыток </span>

                <div class="form-group" v-bind:class="{ 'has-error': error && errors.name }">
                    <span class="help-block" v-if="error && errors.name" v-for="err in errors.name">{{ err }}</span>
                    <input type="text" id="name" class="form-control" v-model="name" placeholder="Имя">
                </div>
                <div class="form-group" v-bind:class="{ 'has-error': error && errors.email }">
                    <span class="help-block" v-if="error && errors.email" v-for="err in errors.email">{{ err }}</span>
                    <input type="email" id="email" class="form-control" placeholder="E-mail" v-model="email">
                </div>
                <div class="form-group" v-bind:class="{ 'has-error': error && errors.password }">
                    <span class="help-block" v-if="error && errors.password" v-for="err in errors.password">{{ err }}</span>
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
                        app.$router.push({name: 'Admin'});
                        app.$root.loading = false;
                    },
                    error: function (resp) {
                        app.$root.loading = false;
                        app.error = true;
                        app.errors = resp.response.data.errors;
                    },
                    redirect: null
                });
            }
        },
        created(){
        }
    }
</script>
