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
                        <router-link :to="{ name: 'home' }">
                            <picture>
                                <img src="img/logo.png" alt="">
                            </picture>
                        </router-link>
                    </div>
                    <div class="header__text"><span>Онлайн-редактор открыток для консультантов </span>
                    </div>
                    <p>
                        <router-link :to="{ name: 'hello' }">Hello World</router-link>
                        <router-link :to="{ name: 'users.index', params: { page: 1 }}">Users</router-link>
                    </p>

                    <div class="header__link"><a href="#Вернуться-на-сайт">Вернуться на сайт</a>
                    </div>
                </div>
            </div>
        </header>

        <div v-if="$root.loading" class="loader_wrap"><div class="loader"></div></div>
        <router-view v-else></router-view>

    </div>
</template>

