<template>
    <div>

        <div v-if="$root.loading" class="loader_wrap">
            <div class="loader"></div>
        </div>
        <router-view v-else></router-view>

    </div>
</template>

<script>
    export default {

        created() {

        }
    }
</script>

