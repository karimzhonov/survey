<template>
<div v-if="loading" class="layout-main row justify-content-center">
    <div class="col">
        <ProgressSpinner style="top:30%; left:47%"/>
    </div>
</div>
<div v-if="!loading">
  <div class="row justify-content-center">
    <div class="row">
        <h1 class="text-center col">{{ $t('Показатели города') }}</h1>
        <div class="col-2 d-flex justify-content-center pl-0 pr-0">
            <Button width="100" icon="pi pi-chart-line" class="p-button-success mr-2 ml-2" :label="$t('Паказать динамику')" @click="line_chart_show = true"/>
        </div>
    </div>
    
    <Dialog :header="$t(`${('Изменения индекса')}`)" v-model:visible="line_chart_show" :style="{ width: '80%', height: '80%'}" :modal="true">
          <LineChart v-if="home_line_chart.city_datasets" :labels="home_line_chart.labels" :dataset="[{name: $t(`Индекс человеческого достоинства`), data: home_line_chart.city_datasets}]" />
          <LineChart :labels="home_line_chart.labels" :dataset="home_line_chart.datasets" />
    </Dialog>


    <div class="col-12 row p-0">
        <div class="col-12 col-lg-3">
            <router-link :to="{name: 'ichd_region', query: {year: $route.query.year, file: $route.query.file}}">
            <div class="card rounded-4" style="padding: 16px" v-tooltip.top="{value: $t(`Нажмите что бы увидеть по районам`), escape: true, class: 'text-center'}">
                <div class="row" style="text-align: center;">
                    <div class="col pl-0 pr-0">
                        <div class="col p-0 text-900 font-medium" style="font-size: 2.5rem">{{home_city_data.index}}</div>
                        <p style="line-height: 3rem; font-size: 1.3rem;" class="text-center text-500 font-medium" >{{$t(`Индекс человеческого достоинства`)}}</p>
                    </div>
                </div>
            </div>
            </router-link>
        </div>
        <div class="col-12 col-lg-3">
            <router-link :to="{name: 'ichd_data_table', query: {file: $route.query.file, year: $route.query.year, index_color:'red'}}">
                <div class="card rounded-4 p-auto">
                    <div style="text-align: center;">
                        <div class="row justify-content-center mb-1 pr-4 align-items-center">
                            <div class="col p-0 text-900 font-medium text-xl">
                                <p class="text-center text-500 font-medium mb-0">{{ $t('Махалли с низким индексом') }}</p> 
                                <p style="font-size: 2rem">{{ home_city_data.area_info.min_count }}</p>
                            </div>
                            <div class="flex align-items-center justify-content-center border-round" style="width:4rem;height:4rem">
                                <font-awesome-icon icon="fa-regular fa-face-frown" style="font-size: 3rem;" class="text-red-500"/>
                            </div>
                        </div>
                    </div>
                </div>
            </router-link>
        </div>
        <div class="col-12 col-lg-3">
            <router-link :to="{name: 'ichd_data_table', query: {file: $route.query.file, year: $route.query.year, index_color:'blue'}}">
            <div class="card rounded-4">
                <div style="text-align: center;">
                    <div class="row justify-content-center mb-1 pr-4 align-items-center">
                        <div class="col p-0 text-900 font-medium text-xl">
                            <p class="text-center text-500 font-medium mb-0">{{ $t('Махалли со средним индексом') }}</p> 
                            <p style="font-size: 2rem">{{ home_city_data.area_info.center_count }}</p>
                        </div>
                        <div class="flex align-items-center justify-content-center border-round" style="width:4rem;height:4rem">
                            <font-awesome-icon icon="fa-regular fa-face-meh" style="font-size: 3rem;" class="text-blue-500"/>
                        </div>
                    </div>
                </div>
            </div>
        </router-link>
        </div>
        <div class="col-12 col-lg-3">
            <router-link :to="{name: 'ichd_data_table', query: {file: $route.query.file, year: $route.query.year, index_color:'green'}}">
            <div class="card rounded-4">
                <div style="text-align: center;">
                    <div class="row justify-content-center mb-1 pr-4 align-items-center">
                        <div class="col p-0 text-900 font-medium text-xl">
                            <p class="text-center text-500 font-medium mb-0">{{ $t('Махалли с высоким индексом') }}</p> 
                            <p style="font-size: 2rem">{{ home_city_data.area_info.max_count }}</p>
                        </div>
                        <div class="flex align-items-center justify-content-center border-round" style="width:4rem;height:4rem">
                            <font-awesome-icon icon="fa-regular fa-face-smile" style="font-size: 3rem;" class="text-green-500"/>
                        </div>
                    </div>
                </div>
            </div>
        </router-link>
        </div>
        <div></div>
    </div>

    <CategoryIndex :items="home_city_data.criteria" :url_params="{name: 'ichd_region-data-table', query: {}}"/>
        
    </div>
<h1 class="m-3 text-center pb-3">{{ $t('Показатели по секторам') }}</h1>

  <div class="grid row justify-content-center">
    <div class="col-12 row p-0 justify-content-center" v-for="sector in home_sectors_data" :key="sector">
        <div class="col-12 col-lg-3 row pt-1 justify-content-center">
            <div class="grid row justify-content-around align-items-between">
                <div class="col-12 card rounded-4 p-0">
                    <div class="pb-2 rounded-3 pt-4">
                        <router-link :to="{name: 'sector_id_region', params: {sector_id: sector.sector.id}, query: $route.query}"
                                    class="text-decoration-none speedometer-label">
                            <speedometer :value="sector.index" :label="sector.sector.translations[$i18n.locale].name" :delta_index="sector.delta_index"/>
                        </router-link>
                    </div>
                </div>
                <router-link class="pb-2 p-0" :to="{name: 'ichd_data_table', query: {file: $route.query.file, year: $route.query.year, index_color:'red', sector: sector.sector.id}}">
                <div class="card p-2 col-12 rounded-4 pb-0">
                    <div style="text-align: center;">
                        <div class="row justify-content-center mb-1 pr-3 pl-3 align-items-center">
                            <div class="col p-0 text-900 font-medium text-xl">
                                <p class="text-center text-500 font-medium">{{ $t('Махалли с низким индексом') }}</p> 
                                <p style="font-size: 1.5rem">{{sector.area_info.min_count ?? 0}}</p>
                            </div>
                            <div class="flex align-items-center justify-content-center border-round" style="width:4rem;height:4rem">
                                <font-awesome-icon icon="fa-regular fa-face-frown" style="font-size: 2.5rem;" class="text-red-500"/>
                            </div>
                        </div>
                    </div>
                </div>
            </router-link>
                <router-link class="pb-2 p-0" :to="{name: 'ichd_data_table', query: {file: $route.query.file, year: $route.query.year,  index_color:'blue', sector: sector.sector.id}}">
                <div class="card p-2 col-12 rounded-4">
                    <div style="text-align: center;">
                        <div class="row justify-content-center mb-1 pr-3 pl-3 align-items-center">
                            <div class="col p-0 text-900 font-medium text-xl">
                                <p class="text-center text-500 font-medium">{{ $t('Махалли со средним индексом') }}</p> 
                                <p style="font-size: 1.5rem">{{sector.area_info.center_count ?? 0}}</p>
                            </div>
                            <div class="flex align-items-center justify-content-center border-round" style="width:4rem;height:4rem">
                                <font-awesome-icon icon="fa-regular fa-face-meh" style="font-size: 2.5rem;" class="text-blue-500"/>
                            </div>
                        </div>
                    </div>
                </div>
            </router-link>
                <router-link class="p-0" :to="{name: 'ichd_data_table', query: {file: $route.query.file, year: $route.query.year, index_color:'green', sector: sector.sector.id}}">
                <div class="card p-2 col-12 rounded-4">
                    <div style="text-align: center;">
                        <div class="row justify-content-center mb-1 pr-3 pl-3 align-items-center">
                            <div class="col p-0 text-900 font-medium text-xl">
                                <p class="text-center text-500 font-medium">{{ $t('Махалли с высоким индексом') }}</p> 
                                <p style="font-size: 1.5rem">{{sector.area_info.max_count ?? 0}}</p>
                            </div>
                            <div class="flex align-items-center justify-content-center border-round" style="width:4rem;height:4rem">
                                <font-awesome-icon icon="fa-regular fa-face-smile" style="font-size: 2.5rem;" class="text-green-500"/>
                            </div>
                        </div>
                    </div>
                </div>
            </router-link>
            </div>
        </div>

        <div class="col-lg-9 col-12 pb-0 pt-0">
            <div class="row justify-content-center">
                <div class="col-12 row pt-0 pl-0 pr-0">
                    <div class="col-12 mb-0 card rounded-4 mb-2 pb-0">
                        <Bar :series="sector.bar.datasets" :labels="sector.bar.labels" @dataPointSelection="async (e, chart, config) => await bar_selected(sector.bar.labels[config.dataPointIndex], sector.sector.id)"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
    
</div>
</template>

<script>
import Speedometer from "@/components/Speedometer.vue";
import store from "@/store";
import Bar from "@/components/Bar.vue";
import LineChart from "@/components/LineChart.vue";
import CategoryIndex from "@/components/CategoryIndex.vue";
import { ICHD } from "../models";
import { Region } from "@/apps/geodata/models";
const ichd = new ICHD()

export default {
  name: "ICHDMainView",
  components: {Speedometer, Bar, LineChart, CategoryIndex},
  data() {
    return {
        line_chart_show: false,
        home_sectors_data: [],
        home_city_data: {},
        home_line_chart: [],
    }
  },
  async mounted() {
    this.home_city_data = await ichd.home_city_data({file: this.$route.query.file, lang: this.$i18n.locale})
    this.home_sectors_data = await ichd.home_sectors_data({file: this.$route.query.file, lang: this.$i18n.locale})
    this.home_line_chart = await ichd.home_line_chart({lang: this.$i18n.locale})
    store.commit('basic', {key: 'loading', value: false})
  },
  methods: {
    async bar_selected(region, sector_id) {
        const region_api = new Region()
        region = await region_api.list({search: region})
        region = region[0]
        this.$router.push({name: 'ichd_sector_id_region_id', params: {sector_id: sector_id, region_id: region.id}, query: {file: this.$route.query.file, year: this.$route.query.year}})
    },
  },
  computed: {
    loading: () => store.state.loading,
  }
}
</script>