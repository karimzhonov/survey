<template>
    <div v-if="loading" class="layout-main row justify-content-center">
        <div class="col">
            <ProgressSpinner style="top:30%; left:47%"/>
        </div>
    </div>
    <div v-if="!loading">
        <BackOrStart :navigator="[]" :home_to="{name: 'news_main'}"/>
        <div class="row m-0 pt-3" style="width: 100%;">
            <div class="col-12 p-0">
                <div class="card rounded-4">
                    <img v-if="news.image" class="pb-3" :src="news.image" :alt="news.id"/>
                    <h2 class="text-center pb-3">{{ news.translations[$i18n.locale] ? news.translations[$i18n.locale].title : '' }}</h2>
                    <div class="row">
                        <div class="col" v-for="img in news.images" :key="img">
                            <img style="width: 100%" :src="img" :alt="img"/>
                        </div>
                    </div>
                    
                    <div class="pt-3 pb-3" v-html="news.translations[$i18n.locale] ? news.translations[$i18n.locale].content : ''"></div>

                    

                    <div class="flex align-items-center justify-content-end text-400 mb-3">
                        <Button class="ml-3" v-for="file in news.files" :key="file"
                        :class="download_file_props[file.file.split('.')[file.file.split('.').length - 1]].color" 
                        :icon="download_file_props[file.file.split('.')[file.file.split('.').length - 1]].icon ?? 'pi pi-file'" :label="file.name" />
                    </div>
                    
                    <div class="flex align-items-center justify-content-between text-400">
                        <div class="flex align-items-center">
                            <img width="50" :src="news.source.image" :alt="news.source.name">
                            <p class="ml-1 text-400">{{ news.source.translations[$i18n.locale] ? news.source.translations[$i18n.locale].title : ''}}</p>
                        </div>
                        <p class="text-400">{{ news.created_at }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import store from '@/store';
import BackOrStart from '@/components/BackOrStart.vue';
import { News } from '@/apps/news/models';
export default {
    name: 'DetailNews',
    props: ['id'],
    data() {
        return {
            news: {},
            download_file_props: {
                'xlsx': {
                    icon: 'pi pi-file-excel',
                    color: 'p-button-success'
                },
                'xls': {
                    icon: 'pi pi-file-excel',
                    color: 'p-button-success'
                },
                'doc': {
                    icon: 'pi pi-file-word',
                    color: 'p-button-info'
                },
                'docx': {
                    icon: 'pi pi-file-word',
                    color: 'p-button-info'
                },
                'ppt': {
                    icon: 'pi pi-file',
                    color: 'p-button-warning'
                },
                'pptx': {
                    icon: 'pi pi-file',
                    color: 'p-button-warning'
                },
                'pdf': {
                    icon: 'pi pi-file-pdf',
                    color: 'p-button-danger'
                },
            }
        }
    },
    async mounted() {
        const news = new News()
        this.news = await news.get(this.id)
        store.commit('basic', {key: 'loading', value: false})
    },
    components: {BackOrStart},
    computed: {
        loading: () => store.state.loading,
    }

}
</script>