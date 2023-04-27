<template>
<div v-if="loading" class="layout-main row justify-content-center">
        <div class="col">
                    <ProgressSpinner style="top:30%; left:47%"/>
                </div>
  </div>
  <div v-if="!loading">
    <BackOrStart :header="criteria.translations[$i18n.locale].name" :navigator="[
                {label: sector.translations[$i18n.locale].name, to: {name: 'sector_id_region', params: {sector_id: sector_id}, query: $route.query}},
                {label: region.translations[$i18n.locale].name, to: {name: 'region_id_sector_id', params: {sector_id: sector_id, region_id: region_id}, query: $route.query}},
                {label: area.translations[$i18n.locale].name, to: {name: 'sector_id_region_id_area_id', params: {sector_id: sector_id, region_id: region_id, area_id: area_id}, query: $route.query}},
            ]" :home_to="{name: 'ichd_main', query: this.$route.query}"/>
  <div class="grid row mt-3 justify-content-around">
    <div class="card mt-3 rounded-4">
      <div class="col-12">
        <MultiSelect
            :showToggleAll="false"
            v-model="selected"
            :options="options"
            option-label="name"
            :placeholder="$t('Выберите квартал')"
            @change="multiselect_change"
            style="width:100%; color: var(--surface-900)"
            class="mb-3"
        >
        <template #value="slotProps">
          {{ slotProps.value.reduce((a, v) => [...a, v.period.translations[$i18n.locale].name], []).join(', ') }}
        </template>
        <template #option="slotProps">
          {{ slotProps.option.period ? slotProps.option.period.translations[$i18n.locale].name : ''}}
        </template>
      </MultiSelect>
        <div class="row">
          <div class="col">
            <div>
              <DataTable :value="data" showGridlines :responsiveLayout="width < 960 ? 'stack': 'scroll'">
                <Column field="file" :header="$t('Квартал')">
                  <template #body="slotProps">
                    <div>{{ slotProps.data[0].upload.period.translations[$i18n.locale].name }}</div>
                  </template>
                </Column>
                <Column v-for="(col, i) in criteriaes" :key="i" :field="col.id" :header="col.translations[$i18n.locale].name">
                  <template #body="slotProps">
                    <div>{{ get_cell(slotProps.data, col) }}</div>
                  </template>
                </Column>
              </DataTable>
            </div>
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
import { ICHD } from "@/apps/ichd/models"
const ichd = new ICHD()

export default {
  name: "CategoryTable",
  props: ['criteria_id', 'region_id', 'sector_id', 'area_id'],
  components: {BackOrStart},
  data() {
    return {
      key: 1,
      options: [],
      selected: []
    }
  },
  async mounted() {
    store.commit('basic', {key: 'data', value: []})
    this.options = await ichd.upload.list()
    this.selected.push(this.options[0])
    await store.dispatch('fetch_geodata_sector', this.sector_id)
    await store.dispatch('fetch_geodata_region', this.region_id)
    await store.dispatch('fetch_geodata_area', this.area_id)
    await store.dispatch('fetch_ichd_category', this.criteria_id)
    await store.dispatch('fetch_criterias', {category: this.criteria_id})
    await store.dispatch('fetch_main_data', {
      area: this.area_id,
      category: this.criteria_id,
      upload: store.state.selected_file.id
    })
    store.commit('basic', {key: 'loading', value: false})
  },
  computed: {
  sector: () => store.state.sector,
    region: () => store.state.region,
    area: () => store.state.area,
    criteria: () => store.state.criteria,
    criteriaes: () => store.state.criteria_list,
    data: () => store.state.data,
    loading: () => store.state.loading,
    width: () => window.innerWidth
  },
  methods: {
    async multiselect_change(e) {
      store.commit('basic', {key: 'data', value: []})
      for (let file of e.value) {
        await store.dispatch('fetch_main_data', {
          area: this.area_id,
          category : this.criteria_id,
          upload: file.id,
        })
      }
    },
    get_cell(data, criteria) {
      for (let d of data) {
        if (criteria.id === d.criteria.id) {
          return d.value
        }
      }
    }
  }
}
</script>

<style scoped>

</style>