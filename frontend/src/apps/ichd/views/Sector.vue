<template>
<div v-if="loading" class="layout-main row justify-content-center">
        <div class="col">
                    <ProgressSpinner style="top:30%; left:47%"/>
                </div>
  </div>
  <div v-if="!loading">
    <div class="row justify-contet-between">
        <div class="col-lg-10 col-6">
          <BackOrStart :header="sector.translations[$i18n.locale].name" :navigator="[]" :home_to="{name: 'ichd_main', query: this.$route.query}"/>
        </div>
        <div class="col-lg-2 col-6 d-flex justify-content-center pl-0 pr-0">
            <Button style="width: 100%" icon="pi pi-chart-line" class="p-button-success mr-2 ml-2" :label="$t('Паказать динамику')" @click="line_chart_show = true"/>
        </div>
    </div>
  
    <Dialog :header="$t('Изменения индекса')" v-model:visible="line_chart_show" :style="{ width: '80%', height: '80%'}" :modal="true">
      <LineChart v-if="ichd_sector_line_chart.sector_data" :labels="ichd_sector_line_chart.labels" :dataset="[{data: ichd_sector_line_chart.sector_data, name: $t(`Индекс человеческого достоинства`)}]" />
      <LineChart :labels="ichd_sector_line_chart.labels" :dataset="ichd_sector_line_chart.datasets" />
    </Dialog>

  <div class="grid mt-3 justify-content-around">
    <CategoryIndex :items="sector_category_index" :url_params="{name: 'ichd_sector_region-data-table', query: {sector: this.sector_id}}"/>
    <div class="col-lg-3 col-12" v-for="item in region_sectors" :key="item.id">
      <div class="card p-2">
        <router-link :to="{name: 'region_id_sector_id', params: {sector_id: sector_id, region_id: item.region.id}, query: $route.query}"
                     class="text-decoration-none speedometer-label">
          <speedometer :value="item.index" :label="item.region.translations[$i18n.locale].name" :delta_index="item.delta_index"/>
        </router-link>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import Speedometer from "@/components/Speedometer.vue";
import BackOrStart from "@/components/BackOrStart.vue";
import store from "@/store";
import LineChart from "@/components/LineChart.vue";
import CategoryIndex from "@/components/CategoryIndex.vue";
import { ICHD } from "../models";
import { Sector } from "@/apps/geodata/models";

const ichd = new ICHD()
const sector = new Sector()

export default {
  name: "Category",
  props: ['sector_id'],
  components: {BackOrStart, Speedometer, LineChart, CategoryIndex},
  data() {
    return {
      params: {},
      line_chart_show: false,
      sector: {},
      region_sectors: [],
      ichd_sector_line_chart: {},
      sector_category_index: [],
    }
  },
  async mounted() {
    this.sector = await sector.get(this.sector_id)
    this.region_sectors = await ichd.region_sector.list({sector: this.sector_id, upload: this.$route.query.file})
    this.ichd_sector_line_chart = await ichd.sector.line_chart(this.sector_id, {}, this.$i18n.locale)
    this.sector_category_index = await ichd.sector.category.list({sector: this.sector_id, upload: this.$route.query.file})
    for (let data of this.sector_category_index) {
      data.translations = data.category.translations
      data.id = data.category.id
    }
    store.commit('basic', {key: 'loading', value: false})
  },
  computed: {
    loading: () => store.state.loading,
  }
}
</script>

<style scoped>

</style>