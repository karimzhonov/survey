<template>
    <div v-if="loading" class="layout-main row justify-content-center">
        <div class="col">
            <ProgressSpinner style="top:30%; left:47%"/>
        </div>
    </div>
    <div v-if="!loading">
        <h2 class="text-center"> {{ $t('Кто мы и что делаем') }}</h2>
        <p class="text-center text-400">{{ $t('about_text') }}</p>
        <h2 class="text-center"> {{ $t('Наша команда') }}</h2>
        <div class="row justify-content-center m-auto" style="width: 100%;">
            <div class="col-lg-3 col-12 p-6" style="word-wrap: break-word;" v-for="personal in personals" :key="personal.id">
                <div style="aspect-ratio : 1 / 1; border-radius: 50%; overflow: hidden">
                    <img style="width: 100%; height: 100%; filter: grayscale(1) contrast(1);" :src="personal.avatar" :alt="personal.fullname">
                </div>
                <h3 class="mt-5 mb-4 text-center" style="font-weight: bold;">{{ personal.translations[$i18n.locale] ? personal.translations[$i18n.locale].fullname : ''}}</h3>
                <p class="text-center" style="font-size: 1.3rem">{{ personal.translations[$i18n.locale] ? personal.translations[$i18n.locale].position : '' }}</p>
                <p class="text-center" style="font-style: italic;font-size: 1rem">{{ personal.translations[$i18n.locale] ? personal.translations[$i18n.locale].deviz : ''}}</p>
            </div>
        </div>
    </div>
</template>
<script>
import { Personal } from '@/apps/about/models';
import store from '@/store';
export default {
    name: 'AboutVue',
    data() {
        return {
            personals: []
        }
    },
    async mounted() {
        const personal = new Personal()
        this.personals = await personal.list()
        store.commit('basic', {key: 'loading', value: false})
    },
    computed: {
        loading: () => store.state.loading,
    }
}
</script>