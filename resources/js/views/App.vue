<template>
    <div>

        <div v-if="$root.loading" class="loader_wrap">
            <div class="loader"></div>
        </div>
        <router-view></router-view>

    </div>
</template>

