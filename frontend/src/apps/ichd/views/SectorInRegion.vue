<template>
<div v-if="loading" class="layout-main row justify-content-center">
        <div class="col">
                    <ProgressSpinner style="top:30%; left:47%"/>
                </div>
  </div>
  <div v-if="!loading">
    <div class="row justify-contet-between">
        <div class="col-lg-10 col-6">
          <BackOrStart :header="sector.translations[$i18n.locale].name" :navigator="[
                {label: region.translations[$i18n.locale].name, to: {name: 'region_id_sector', params: {region_id: region_id}, query: $route.query}},
            ]" :home_to="{name: 'ichd_main', query: this.$route.query}"/>
        </div>
        <div class="col-lg-2 col-6 d-flex justify-content-center pl-0 pr-0">
            <Button style="width: 100%" icon="pi pi-chart-line" class="p-button-success mr-2 ml-2" :label="$t('Паказать динамику')" @click="line_chart_show = true"/>
        </div>
    </div>
    <Dialog :header="$t('Изменения индекса')" v-model:visible="line_chart_show" :style="{ width: '80%', height: '80%'}" :modal="true">
      <LineChart v-if="ichd_region_sector_line_chart.sector_region_data" :labels="ichd_region_sector_line_chart.labels" :dataset="[{data: ichd_region_sector_line_chart.sector_region_data, name: $t(`Индекс человеческого достоинства`)}]" />
      <LineChart :labels="ichd_region_sector_line_chart.labels" :dataset="ichd_region_sector_line_chart.datasets" />
    </Dialog>
  <div class="grid row mt-3 justify-content-around">
    <CategoryIndex :items="region_sector_category_index" :url_params="{name: 'ichd_area-data-table', query: {sector: sector_id, region: region_id}}"/>
    <div class="col-lg-3 col-12" v-for="item in areas" :key="item">
      <div class="card p-2">
        <router-link
            :to="{name: 'sector_id_region_id_area_id', params: {sector_id: sector_id, region_id: region_id, area_id: item.area.id}, query: $route.query}"
            class="text-decoration-none speedometer-label">
          <speedometer :value="parseFloat(item.index.replace(',', '.'))" :label="item.area.translations[$i18n.locale].name" :delta_index="item.delta_index"/>
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
import { ICHD } from "../models";
import { Region, Sector } from "@/apps/geodata/models";

const ichd = new ICHD()
const region = new Region()
const sector = new Sector()

export default {
  name: "SectorInRegion",
  props: ['region_id', 'sector_id'],
  components: {BackOrStart, Speedometer, LineChart, CategoryIndex},
  data() {
    return {
      params: {},
      line_chart_show: false,
      region: {},
      sector: {},
      areas: [],
      ichd_region_sector_line_chart: {},
      region_sector_category_index: [],
    }
  },
  methods: {
    async selected_bar(e) {
      await this.$router.push({name: 'sector_id_region_id_area_id_table_id', params: {id: this.id, table_id: e.element.index}})
    },
  },
  async mounted() {
    this.region = await region.get(this.region_id)
    this.sector = await sector.get(this.sector_id)
    this.areas = await ichd.area.list({upload: this.$route.query.file, region: this.region_id, sector: this.sector_id})
    this.ichd_region_sector_line_chart = await ichd.region_sector.line_chart(this.region_id, this.sector_id, {}, this.$i18n.locale)
    this.region_sector_category_index = await ichd.region_sector.category.list({upload: this.$route.query.file, region: this.region_id, sector: this.sector_id})
    for (let data of this.region_sector_category_index) {
      data.translations = data.category.translations
      data.id = data.category.id
    }
    store.commit('basic', {key: 'loading', value: false})
  },
  computed: {
    loading: () => store.state.loading,
  },
}
</script>

<style scoped>

</style>