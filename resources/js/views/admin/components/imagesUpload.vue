<template>
    <form @submit.prevent="uploadImage($event, cat, index)" enctype="multipart/form-data">

        <div class="elementcontent__btn">
            <label class="btn" :for="cat.id + 'file'"> Выберите файл/ы ({{cat.accepted}})</label>
            <input type="file" multiple :id="cat.id + 'file'" class="form-control"
                   :accept="cat.accepted"
                   @change="onInputFile($event, cat)" style="display: none;">

            <input type="submit" :id="cat.id + 'submit'" style="display: none;" :disabled="!cat.files">
        </div>

        <div v-if="cat.files && cat.files.length" class="files">
            <p>Файлы для загрузки:</p>
            <span v-for="file in cat.files">{{file.name}}</span>
            <label class="btn" :for="cat.id + 'submit'"> Загрузить</label>
        </div>

    </form>
</template>

<script>

    import Vue from 'vue'
    import axios from 'axios'

    import VueToast from 'vue-toast-notification';
    import 'vue-toast-notification/dist/index.css';
    Vue.use(VueToast);

    export default {
        props: ['cat', 'index'],
        methods: {

            uploadImage(e, cat, catIndex) {
                this.$root.loading = true;

                const config = {
                    headers: {'content-type': 'multipart/form-data'}
                };

                let file = cat.files.shift();

                let app = this;
                let formData = new FormData();
                let totalImages = app.$root.data.images[catIndex].images.length;

                formData.append('file', file);
                formData.append('folder', cat.folder);
                formData.append('cat', cat.id);
                formData.append('sort', totalImages);

                axios.post('/images/save', formData, config)
                    .then(res => {

                        //Vue.$toast.open(res.data.toast);

                        if (res.data.image)
                            cat.images.push(res.data.image);
                    })
                    .catch(error => {

                        let validator = error.response.data.messeges;

                        if (validator)
                            Object.keys(validator).forEach(input => {
                                validator[input].forEach(msg => Vue.$toast.error(msg, {duration: 20000}))
                            });
                        else
                            Vue.$toast.error(error.toString());
                    })
                    .finally(() => {

                        if (cat.files.length)
                            app.uploadImage(e, cat, catIndex)
                        else {
                            app.$root.loading = false;
                        }

                        app.$emit('upload');
                        this.$forceUpdate();
                    })

            },
            onInputFile(e, cat) {

                cat.files = Array.from(e.target.files);
                this.$forceUpdate();
            },

        }
    }
</script>
