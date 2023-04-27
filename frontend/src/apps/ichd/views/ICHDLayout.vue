<template>
<div style="position: fixed; bottom: 50px; right: 50px; z-index: 10;">
    <router-link v-if="user" :to="{name: 'ichd_uploader'}">
        <Button icon="pi pi-pencil" severity="primary" style="border-radius: 20px;" :label="$t('Загрузка данные')"/>
    </router-link>
</div>
<div class="row justify-content-center align-items-center">
    <div class="col col-lg-10">
        <div>
            <div class="home-main-header mb-1 row align-items-center">
                <img style="color: var(--surface-900)" class="col col-lg-3" :src="logo" width="150"/>
                <h1 class="col col-lg-9">{{ $t("Индекс человеческого достоинства") }}</h1>
            </div>
        </div>
    </div>
    <div class="col-12 col-lg-2 flex justify-content-end">
        <CascadeSelect v-model="selected_file" :options="top_bar_years" optionLabel="period" optionGroupLabel="year"
                        :optionGroupChildren="['files']" style="width: 100%" @change="file_change">
            <template #value="data">
                {{ data.value.period && data.value.period.translations[$i18n.locale] ? data.value.period.translations[$i18n.locale].name : "" }}
            </template> 
            <template #option="data">
                {{ data.option.period && data.option.period.translations[$i18n.locale] ? data.option.period.translations[$i18n.locale].name : data.option.year }}
            </template> 
        </CascadeSelect>
    </div>
    
</div>
<RouterView></RouterView>
</template>
<script>
import store from '@/store';
import logo_light from "@/assets/images/logo minimalis.svg"
import logo_dark from "@/assets/images/logo minimalist light (1).svg"
import { ICHD, IchdUploader } from "@/apps/ichd/models"
const ichd = new ICHD()
const ichd_uploader = new IchdUploader()

export default {
    name: 'ICHDLoyaut',
    data() {
        return {
            logo_dark, logo_light,
            user: null,
        }
    },
    async mounted() {
        try {this.user = await ichd_uploader.user.get()} catch (error) {}
        const table = await ichd.upload.list()
        const years = {}
        for (let file of table) {
            if (!years[file.period.filter_date.split('-')[0]]) {
                years[file.period.filter_date.split('-')[0]] = {
                    year: file.period.filter_date.split('-')[0],
                    files: [],
                }
            }
            years[file.period.filter_date.split('-')[0]].files.push(file)
        }

        store.commit('basic', {key: 'top_bar_years', value: Object.values(years)})
        const params = {
            file: this.$route.query.file ? this.$route.query.file : table[0].id,
            ...this.$route.query
        }
        let selected_file = {}

        for (let file of table) {
            if (file.id == params.file) {
                selected_file = file
            }
        }
        if (this.$route.query.file !== params.file) {
            await this.$router.replace({name: this.$route.name, params: this.$route.params, query: params})        }

        store.commit('basic', {key: 'selected_file', value: selected_file})
    },
    computed: {
        top_bar_years: () => store.state.top_bar_years,
        selected_file: () => store.state.selected_file,
        logo() {
            return !store.state.darkMode ? this.logo_light : this.logo_dark
        }
    },
    methods: {
        year_change(e) {
            store.commit('basic', {key: 'selected_year', value: e.value})
        },
        file_change(e) {
            const url = new URL(window.location)
            url.searchParams.set('file', e.value.id)
            url.searchParams.set('light', !store.state.darkMode ? 1 : 0)
            window.location = url
            store.commit('basic', {key: 'selected_file', value: e.value})
        },
    }
}
</script>

<style>

.home-main-header {
  margin-bottom: 5rem;
  font-size: 2.5rem;
  text-transform: uppercase;
  text-align: center;
  line-height: 70px;
  color: var(--surface-900);
}
</style>