<template>
<div v-if="loading" class="layout-main row justify-content-center">
    <div class="col">
        <ProgressSpinner style="top:30%; left:47%"/>
    </div>
</div>
<div v-if="!loading">
    <BackOrStart :header="region.translations[$i18n.locale].name" :navigator="[
                {label: sector.translations[$i18n.locale].name, to: {name: 'sector_id_region', params: {sector_id: sector_id}, query: $route.query}},
            ]" :home_to="{name: 'ichd_main', query: this.$route.query}"/>
    <div class="card rounded-4 mt-3">
        <Bar :series="sector_region_bar_chart_data.datasets" :labels="sector_region_bar_chart_data.labels" @dataPointSelection="(e, chart, config) => bar_selected(sector_region_bar_chart_data.labels[config.dataPointIndex])"/>
    </div>
</div>
</template>
<script>
import store from '@/store';
import BackOrStart from '@/components/BackOrStart.vue';
import Bar from '@/components/Bar.vue';
import { ICHD } from '../models';
import { Region, Sector } from '@/apps/geodata/models';

const ichd = new ICHD()
const region = new Region()
const sector = new Sector()

export default {
    name: 'Region',
    props: ['region_id', 'sector_id'],
    components: {BackOrStart, Bar},
    data() {
        return {
            region: {},
            sector: {},
            sector_region_bar_chart_data: {}
        }
    },
    async mounted() {
        this.region = await region.get(this.region_id)
        this.sector = await sector.get(this.sector_id)
        this.sector_region_bar_chart_data = await ichd.region_sector.bar(this.region_id, this.sector_id, {upload: this.$route.query.file}, this.$i18n.locale)
        store.commit('basic', {key: 'loading', value: false})
    },
    methods: {
        async bar_selected(criteria) {
            criteria = await ichd.category.list({search: criteria})
            this.$router.push({name: 'ichd_sector_id_region_id_criteria_id', params: {sector_id: this.sector_id, region_id: this.region_id, criteria_id: criteria[0].id}, query: {file: this.$route.query.file, year: this.$route.query.year}})
        }
    },
    computed: {
        loading: () => store.state.loading,
    }
}
</script>