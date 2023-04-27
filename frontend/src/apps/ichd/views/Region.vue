<template>
<div v-if="loading" class="layout-main row justify-content-center">
        <div class="col">
                    <ProgressSpinner style="top:30%; left:47%"/>
                </div>
  </div>
  <div v-if="!loading">
    <div class="row justify-contet-between">
        <div class="col-lg-10 col-6">
          <BackOrStart :header="region.translations[$i18n.locale].name" :navigator="[]" :home_to="{name: 'ichd_main', query: this.$route.query}"/>
        </div>
        <div class="col-lg-2 col-6 d-flex justify-content-center pl-0 pr-0">
            <Button style="width: 100%" icon="pi pi-chart-line" class="p-button-success mr-2 ml-2" :label="$t('Паказать динамику')" @click="line_chart_show = true"/>
        </div>
    </div>
    <Dialog :header="$t(`${('Изменения индекса')}`)" v-model:visible="line_chart_show" :style="{ width: '80%', height: '80%'}" :modal="true">
          <LineChart v-if="ichd_region_line_chart.region_data" :labels="ichd_region_line_chart.labels" :dataset="[{data: ichd_region_line_chart.region_data, name: $t(`Индекс человеческого достоинства`)}]" />
          <LineChart :labels="ichd_region_line_chart.labels" :dataset="ichd_region_line_chart.datasets" />
    </Dialog>

  <div class="grid mt-3 row justify-content-around">
    <CategoryIndex :items="region_category_index" :url_params="{name: 'ichd_region_sector-data-table', query: {region: this.region_id}}"/>
    <div class="col-lg-3 col-12" v-for="item in region_sectors" :key="item">
      <div class="card p-2">
        <router-link :to="{name: 'region_id_sector_id', params: {sector_id: item.sector.id, region_id: region_id}, query: $route.query}"
                     class="text-decoration-none speedometer-label">
          <speedometer :value="item.index" :label="item.sector.translations[$i18n.locale].name" :delta_index="item.delta_index"/>
        </router-link>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import Speedometer from "@/components/Speedometer.vue";
import BackOrStart from "@/components/BackOrStart.vue";
import store from "@/store"
import LineChart from "@/components/LineChart.vue";
import CategoryIndex from "@/components/CategoryIndex.vue";
import { Region } from "@/apps/geodata/models";
import { ICHD } from "../models";

const ichd = new ICHD()
const region = new Region()

export default {
  name: "Region",
  props: ['region_id'],
  components: {Speedometer, BackOrStart, LineChart, CategoryIndex},
  data() {
    return {
      params: {},
      line_chart_show: false,
      region: {},
      region_sectors: [],
      ichd_region_line_chart: {},
      region_category_index: []
    }
  },
 async mounted() {
    this.region = await region.get(this.region_id)
    this.region_sectors = await ichd.region_sector.list({region: this.region_id, upload: this.$route.query.file})
    this.ichd_region_line_chart = await ichd.region.line_chart(this.region_id, {}, this.$i18n.locale)
    const region_category_index = await ichd.region.category.list({region: this.region_id, upload: this.$route.query.file})
    for (let data of region_category_index) {
        data.id = data.category.id
        data.translations = data.category.translations
    }
    this.region_category_index = region_category_index
    store.commit('basic', {key: 'loading', value: false})
 },
  computed: {
    loading: () => store.state.loading,
  },
}
</script>

<style scoped>

</style>