<template>
    <div v-if="loading" class="layout-main row justify-content-center">
            <div class="col">
                        <ProgressSpinner style="top:30%; left:47%"/>
                    </div>
      </div>
      <div v-if="!loading">
        <BackOrStart :header="$t('По районам')" :navigator="[]" :home_to="{name: 'ichd_main', query: this.$route.query}"/>
      <div class="card rounded-4 mt-3 p-0">
        <Bar :series="all_region_bar.datasets" :labels="all_region_bar.labels" @dataPointSelection="async (e, chart, config) => await bar_selected(all_region_bar.labels[config.dataPointIndex])"/>
      </div>
    </div>
    </template>
    
<script>
import store from "@/store";
import Bar from "@/components/Bar.vue";
import BackOrStart from "@/components/BackOrStart.vue";
import { ICHD } from "../models";
import { Region } from "@/apps/geodata/models";

const ichd = new ICHD()
const region_api = new Region()

export default {
  name: "RegionView",
  components: {Bar, BackOrStart},
  data() {
    return {
      all_region_bar: {},
    }
  },
  async mounted() {
    this.all_region_bar = await ichd.region.bar_all({file: this.$route.query.file},  this.$i18n.locale)
    store.commit('basic', {key: 'loading', value: false})
  },
  methods: {
      async bar_selected(region) {
        region = await region_api.list({search: region})
        this.$router.push({name: 'region_id_sector', params: {region_id: region[0].id}, query: {file: this.$route.query.file, year: this.$route.query.year}})
    },
  },
  computed: {
    loading: () => store.state.loading,
  }
}
</script>

<style>
.home-main-header {
  margin-bottom: 5rem;
  font-size: 3rem;
  text-transform: uppercase;
  text-align: center;
}
.guide-hover:hover {
  box-shadow: 1px 1px 3px 3px #CCCCCC;
}
</style>
Footer
© 2023 GitHub, Inc.
Footer navigation
Terms
Privacy
Security
Status
Docs
Contact GitHub
Pricing
API
Training
Blog
About
