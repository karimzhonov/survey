<template>
<div class="row justify-content-center align-items-center" style="width: 100%;">
    <div class="col col-lg-9">
        <div>
            <div class="home-main-header mb-1">
                {{ $t("Паспортные показатели районов") }}
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
import { Upload } from '@/apps/passport/models';

export default {
    name: 'ICHDLoyaut',
    data() {
        return {
        }
    },
    async mounted() {
        const upload = new Upload()
        const table = await upload.list()

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
            year: this.$route.query.year ? this.$route.query.year : Object.values(years)[0].year,
            file: this.$route.query.file ? this.$route.query.file : Object.values(years)[0].files[0].id
        }
        let selected_file = {}

        for (let file of years[params.year].files) {
            if (file.id == params.file) {
                selected_file = file
            }
        }
        if (thir.$route.query.file !== params.file) {
            await this.$router.replace({name: this.$route.name, params: this.$route.params, query: params})
        }

        store.commit('basic', {key: 'selected_year', value: years[this.$route.query.year]})
        store.commit('basic', {key: 'selected_file', value: selected_file})
    },
    computed: {
        top_bar_years: () => store.state.top_bar_years,
        selected_file: () => store.state.selected_file,
        selected_year: () => store.state.selected_year,
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