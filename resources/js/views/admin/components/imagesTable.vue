<template>
    <div class="elementtable" >
        <div class="elementtable__head">
            <div class="elementtable__tr elementtable__tr-1"></div>
            <div class="elementtable__tr elementtable__tr-2"><span>For consultant</span>
            </div>
            <div class="elementtable__tr elementtable__tr-3"><span>For clients</span>
            </div>
            <div class="elementtable__tr elementtable__tr-4"><span>Sort</span>
            </div>
            <div class="elementtable__tr elementtable__tr-5"></div>
        </div>
        <draggable
            tag="div"
            v-bind="dragOptions"

            v-model="cat.images"
            handle=".updown_handle"
            @start="drag=true;"
            @end="drag=false; uploadSort($event, cat.images) ">

            <transition-group type="transition" :name="!drag ? 'flip-list' : null">

                <div class="elementtable__row"
                     v-for="(image, j) in orderBy(cat.images, 'sort')"
                     :key="image.id">

                    <div class="elementtable__tr elementtable__tr-1">
                        <picture>
                            <img :src="'../' + image.src" alt="IMG">
                        </picture>
                    </div>
                    <div class="elementtable__tr elementtable__tr-2">
                        <input type="checkbox" v-model="image.show_consultant"
                               @change="updateShow(image, 'show_client')">
                    </div>
                    <div class="elementtable__tr elementtable__tr-3">
                        <input type="checkbox" v-model="image.show_client"
                               @change="updateShow(image, 'show_consultant')">
                    </div>
                    <div class="elementtable__tr elementtable__tr-4">
                        <div class="updown updown_handle">
                            <div class="updown__up">
                                <svg class="svg svg-up" width="50" height="50"
                                     :class="{unactive: j === 0}">
                                    <use xlink:href="/ico/sprite/sprite.svg#up"></use>
                                </svg>
                            </div>
                            <div class="updown__down">
                                <svg class="svg svg-down" width="50" height="50"
                                     :class="{unactive: j === cat.images.length -1}">
                                    <use xlink:href="/ico/sprite/sprite.svg#down"></use>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="elementtable__tr elementtable__tr-5">
                        <button @click="deleteImage(cat.images, image, j)"><span>Delete</span>
                        </button>
                    </div>

                </div>

            </transition-group>

        </draggable>
    </div>

</template>

<script>


    import Vue from 'vue'
    import axios from 'axios'

    import Vue2Filters from 'vue2-filters'

    Vue.use(Vue2Filters)

    import draggable from 'vuedraggable'

    Vue.component('draggable', draggable)


    export default {
        mixins: [Vue2Filters.mixin],
        props: ['cat'],
        data() {
            return {
                drag: false,
            }
        },
        methods: {
            Api(command, objects, msg = null) {
                axios
                    .post('images/' + command, objects)
                    .then(res => {
                        //if (msg) Vue.$toast.open(msg);
                    })
                    .catch(error => {

                        Vue.$toast.open({
                            message: error.toString(),
                            type: 'error',
                        });
                    });
            },
            updateShow(image, show) {
                let showValue = image[show];
                showValue = (showValue) ? 1 : 0;
                this.Api('update', [image])
                this.$forceUpdate();
            },
            uploadSort(ev, images) {
                if (ev.newIndex !== ev.oldIndex) {

                    images.forEach((img, i) => {
                        img.sort = i
                    });

                    this.Api('update', images)

                }
            },
            deleteImage(images, image, index) {

                this.$delete(images, index);


                images.forEach((img, i) => {
                    img.sort = i
                });

                this.Api('update', images);
                this.Api('destroy', image)

                this.$forceUpdate();

            },

        },
        computed: {
            dragOptions() {
                return {
                    animation: 200,
                    group: "description",
                    disabled: false,
                    ghostClass: "ghost"
                };
            },
        },
    }
</script>
