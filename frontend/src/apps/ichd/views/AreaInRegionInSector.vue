<template>
<div v-if="loading" class="layout-main row justify-content-center">
        <div class="col">
                    <ProgressSpinner style="top:30%; left:47%"/>
                </div>
  </div>
  <div v-if="!loading">

<div class="row justify-contet-between">
        <div class="col-lg-10 col-6">
          <BackOrStart :header="area.translations[$i18n.locale].name" :navigator="[
                {label: sector.translations[$i18n.locale].name, to: {name: 'sector_id_region', params: {sector_id: sector_id}, query: $route.query}},
                {label: region.translations[$i18n.locale].name, to: {name: 'region_id_sector_id', params: {sector_id: sector_id, region_id: region_id},  query: $route.query}},
            ]" :home_to="{name: 'ichd_main', query: this.$route.query}"/>
        </div>
        <div class="col-lg-2 col-6 d-flex justify-content-center pl-0 pr-0">
            <Button style="width: 100%" icon="pi pi-chart-line" class="p-button-success mr-2 ml-2" :label="$t('Паказать динамику')" @click="line_chart_show = true"/>
        </div>
    </div>
    <Dialog :header="$t('Изменения индекса')" v-model:visible="line_chart_show" :style="{ width: '80%', height: '80%'}" :modal="true">
      <LineChart v-if="ichd_area_line_chart.area_data" :labels="ichd_area_line_chart.labels" :dataset="[{data: ichd_area_line_chart.area_data, name: $t(`Индекс человеческого достоинства`)}]" />
      <LineChart :labels="ichd_area_line_chart.labels" :dataset="ichd_area_line_chart.datasets" />
    </Dialog>
  <div class="grid row mt-3 justify-content-around">
    <div class="card mt-3 rounded-4">
      <div class="col-12">
        <div class="row">
          <div class="col-12">
            <Bar :series="ichd_area_bar.datasets" :labels="ichd_area_bar.labels" @dataPointSelection="(e, chart, config) => selected_bar(ichd_area_bar.labels[config.dataPointIndex])"/>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import store from "@/store"
import BackOrStart from "@/components/BackOrStart.vue";
import LineChart from "@/components/LineChart.vue";
import Bar from "@/components/Bar.vue";
import { Area, Region, Sector } from "@/apps/geodata/models";
import { ICHD } from "../models";

const area = new Area()
const region = new Region()
const sector = new Sector()
const ichd = new ICHD()

export default {
  name: "AreaInRegionInSector",
  props: ['region_id', 'sector_id', 'area_id'],
  components: {BackOrStart, Bar, LineChart},
  data() {
    return {
      line_chart_show: false,
      sector: {},
      region: {},
      area: {},
      ichd_area_bar: {},
      ichd_area_line_chart: {},
    }
  },
  methods: {
    async selected_bar(name) {
      const criteria = await ichd.category.list({search: name})
      await this.$router.push({
        name: 'sector_id_region_id_area_id_table_id', params: {
          sector_id: this.sector_id, criteria_id: criteria[0].id,
          region_id: this.region_id, area_id: this.area_id,
        },  query: this.$route.query
      })
    },
  },
  async mounted() {
    this.sector = await sector.get(this.sector_id)
    this.region = await region.get(this.region_id)
    this.area = await area.get(this.area_id)
    this.ichd_area_bar = await ichd.area.bar(this.area_id, {file: this.$route.query.file}, this.$i18n.locale)
    this.ichd_area_line_chart = await ichd.area.line_chart(this.area_id, {}, this.$i18n.locale)
    store.commit('basic', {key: 'loading', value: false})
  },
  computed: {
    loading: () => store.state.loading,
  }
}
</script>

<style scoped>

</style>