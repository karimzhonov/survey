<template>
<div v-if="loading" class="layout-main row justify-content-center">
        <div class="col">
                    <ProgressSpinner style="top:30%; left:47%"/>
                </div>
  </div>
  <div v-if="!loading">
    <BackOrStart :header="`${region.translations[$i18n.locale].name} (${criteria.translations[$i18n.locale].name})`" :navigator="[
      {label: $t('Районы'), to: {name: 'ichd_region-data-table', query: {file: $route.query.file, year: $route.query.year, criteria: $route.query.criteria}}},
    ]" :home_to="{name: 'ichd_main', query: this.$route.query}"/>
    <div class="card mt-3 rounded-4 p-1">
      <div class="col-12">
        <div class="row">
          <div class="col">
            <div>
                <DataTable ref="dt" :value="data" showGridlines :responsiveLayout="width < 960 ? 'stack': 'scroll'">
                  <template #header>
                      <div style="text-align: right">
                        <Button icon="pi pi-external-link" class="p-button-success" :label="$t('Скачать Excel')" @click="exportExcel"/> 
                      </div>
                  </template>
                    <Column field="area" :header="width < 960 ? $t('Махалля') : null">
                      <template #header>
                        <p style="font-size: 1.5rem;" class="text-center m-auto">{{ $t('Махалля') }}</p>
                      </template>
                      <template #body="slotProps">
                        <p class="text-center" style="font-size: 1.5rem">{{ slotProps.data.area.translations[$i18n.locale].name }}</p>
                    </template>
                    </Column>
                    <Column v-for="(col, i) in criteriaes" :key="i" :field="col.name" :header="width < 960 ? $t(col.name) : null">
                      <template #header v-if="width > 960">
                        <p class="text-center m-auto" style="font-size: 1.3rem">{{ $t(col.translations[$i18n.locale].name) }}</p>
                      </template>
                    <template #body="slotProps">
                      <router-link v-if="has_criteria_data(slotProps.data, col)" :to="{name: 'ichd_area-criteria-data-table', params:{area_id: slotProps.data.area.id}, query: {...this.$route.query, inner_criteria: col.id}}">
                        <p class="text-center" style="font-size: 1.5rem">
                            {{ get_cell(slotProps.data, col) }}
                        </p>
                      </router-link>
                        <p v-else class="text-center" style="font-size: 1.5rem">
                            {{ get_cell(slotProps.data, col) }}
                        </p>
                    </template>
                    </Column>
                </DataTable>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import store from '@/store';
import BackOrStart from '@/components/BackOrStart.vue';
import exportFromJSON from "export-from-json";
import { ICHD } from '../models';
import { Region } from '@/apps/geodata/models';
const ichd = new ICHD()
const region = new Region()

export default {
    name: 'AreaDataTableView',
    components: {BackOrStart},
    data() {
      return {
        criteria: {},
        region: {},
        criteriaes: [],
        data: [],
      }
    },
    async mounted() {
        this.criteria = await ichd.category.get(this.$route.query.criteria)
        this.region = await region.get(this.$route.query.region)
        this.criteriaes = await ichd.criteria.list({category: this.$route.query.criteria})
        const data = await ichd.area.table.list({upload: this.$route.query.file, category: this.$route.query.criteria, region: this.$route.query.region, sector: this.$route.query.sector})
        const d = {}
        for (let area of data) {
            if (!d[area.area.id]) {
                d[area.area.id] = {area: area.area, data: [area]}
            } else {
                d[area.area.id].data.push(area)
            }
        }
        this.data = Object.values(d)
        store.commit('basic', {key: 'loading', value: false})
    },
    computed: {
        loading: () => store.state.loading,
        width: () => window.innerWidth
    },
    methods: {
      get_cell(area, criteria) {
        for (let d of area.data) {
          if (criteria.id == d.criteria.id) {
            return d.value
          }
        }
      },
      has_criteria_data(area, criteria) {
        for (let d of area.data) {
          if (criteria.id == d.criteria.id) {
            return d.has_criteria_data
          }
        }
      },
      exportExcel() {
        const data = []
        for (let row of this.data) {
          const row_excel = {}
          row_excel[`${this.$t('Район')}`] = row.area.translations[this.$i18n.locale].name
          for (let d of row.data) {
              row_excel[d.criteria.translations[this.$i18n.locale].name] = d.value
          }
          data.push(row_excel)
        }
        exportFromJSON({data: data, fileName: `${this.region.translations[this.$i18n.locale].name} (${this.$t(this.criteria.translations[this.$i18n.locale].name)})`, exportType: exportFromJSON.types.xls})
      }
    }
}
</script>