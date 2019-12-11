<template>
    <div class="constructor__menu js__scroll" :class="{active : menu.open}">
        <div class="menu">

            <div class="menu__item" data-fancybox data-src="#selectsize">
                <span>Размер</span>
                <em>Для поста {{options.size.name}} <br> {{options.size.width}} x {{options.size.height}}px</em>
            </div>

            <div v-for="(menuItem, i) in [].concat(imagesData, menu.textAreas, menu.lists)" class="menu__item js__tab-btn"
                 :key="menuItem.id"
                 :ref="'menu'"
                 :class="{ 'active': menu.active === i }"
                 @click="menu.active = i">

                <span>{{menuItem.menu_name}}</span>
            </div>

        </div>

    </div>

</template>

<script>
    export default {
        props: ['menu', 'options', 'imagesData'],
    }
</script>
