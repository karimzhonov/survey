<template>
    <div v-if="loading" class="layout-main row justify-content-center">
        <div class="col">
            <ProgressSpinner style="top:30%; left:47%"/>
        </div>
    </div>
    <div v-if="!loading">
        <div class="row" style="width: 100%;">
            <div class="col col-lg-6" v-for="news in list_news" :key="news.id">
                <RouterLink :to="{name: 'news_datail', params: {id: news.id}}">
                    <div class="card rounded-4">
                        <div style="aspect-ratio : 1 / 1; overflow-y: hidden;" class="mb-3">
                            <img style="width: 100%" v-if="news.image" class="pb-3" :src="news.image" :alt="news.id"/>
                            <h4 class="text-center">{{ news.translations[$i18n.locale] ? news.translations[$i18n.locale].title : '' }}</h4>
                            <p>{{ news.translations[$i18n.locale] ? news.translations[$i18n.locale].desc : '' }}</p>
                        </div>
                        <div class="flex align-items-center justify-content-between text-400">
                            <div class="flex align-items-center">
                                <img width="50" :src="news.source.image" :alt="news.source.name">
                                <p class="ml-1 text-400">{{ news.source.translations[$i18n.locale] ? news.source.translations[$i18n.locale].title : ''}}</p>
                            </div>
                            <p class="text-400">{{ news.created_at }}</p>
                        </div>
                    </div>
                </RouterLink>
            </div>
        </div>
    </div>
</template>
<script>
import store from '@/store';
import {News} from "@/apps/news/models"

export default {
    name: 'ListNews',
    data() {
        return {
            list_news: []
        }
    },
    async mounted() {
        const news = new News()
        this.list_news = await news.list()
        
        store.commit('basic', {key: 'loading', value: false})
    },
    computed: {
        loading: () => store.state.loading,
    }
}
</script>