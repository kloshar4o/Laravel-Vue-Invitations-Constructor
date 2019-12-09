<template>
    <div>

        <header class="header">
            <div class="container">
                <div class="header__wrap">
                    <div class="header__menubtn js__open-menu">
                        <div class="hamburger"><span></span>
                        </div>
                    </div>
                    <div class="header__logo">
                        <picture>
                            <img src="img/logo.png" alt="">
                        </picture>
                    </div>
                    <div class="header__text"><span>Онлайн-редактор открыток для консультантов </span>
                    </div>

                    <p @click.native="test()">
                        <router-link @click.native="addLoader" :to="{ name: 'home' }">Home</router-link>
                        <router-link @click.native="addLoader" :to="{ name: 'hello' }">Hello World</router-link>
                        <router-link @click.native="addLoader" :to="{ name: 'users.index', params: { page: 1 }}">Users</router-link>
                    </p>

                    <div class="header__link"><a href="#Вернуться-на-сайт">Вернуться на сайт</a>
                    </div>
                </div>
            </div>
        </header>


        <router-view></router-view>

        <div class="loader_wrap">
            <div class="loader"></div>
        </div>
    </div>
</template>

<script>

    export default {
        data(){
            return {
                loading: false
            }
        },
        methods:{
            addLoader(){
                this.loading = true;
            }
        }
    }
</script>
