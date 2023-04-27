<template>
  <div v-if="loading" class="layout-main row justify-content-center">
        <div class="col">
                    <ProgressSpinner style="top:30%; left:47%"/>
                </div>
  </div>
  <div v-if="!loading">
    <BackOrStart :header="`${$t(area.translations[$i18n.locale].name)} (${criteria.translations[$i18n.locale].name})`" :navigator="[
      {label: $t('Районы'), to: {name: 'ichd_region-data-table', query: {file: $route.query.file, year: $route.query.year, criteria: $route.query.criteria}}},
      {label: $t(region.translations[$i18n.locale].name), to: {name: 'ichd_area-data-table', query: {file: $route.query.file, year: $route.query.year, criteria: $route.query.criteria ?? criteria.category, region: this.$route.query.region, sector: $route.query.sector}}},
    ]" :home_to="{name: 'ichd_main', query: this.$route.query}"/>
    <div class="card mt-3 rounded-4 p-1">
      <div class="col-12">
        <div class="row">
          <div class="col">
            <div>
                <DataTable ref="dt" :value="data" showGridlines :responsiveLayout="width < 960 ? 'stack': 'scroll'" >
                    <Column :field="`rows.${i}.value`" v-for="column, i in columns" :key="i" 
                    :header="width < 960 ? column.translations[$i18n.locale].name : null" >
                      <template #header v-if="width > 960">
                        <p style="font-size: 1rem;" class="text-center m-auto">{{ $t(column.translations[$i18n.locale].name) }}</p>
                      </template>
                      <template #body="slotProps">
                        <p class="text-center" style="font-size: 0.9rem">{{ get_cell(slotProps.data.rows, column) }}</p>
                      </template>
                      <!-- <template #filter="{filterModel,filterCallback}">
                          <MultiSelect v-if="is_it_filterable(column)" v-model="filterModel.value" 
                          :options="filter_data[column.id]" @change="filterCallback" :placeholder="`${$t('Выберите')}`" class="p-column-filter">
                          </MultiSelect>
                      </template> -->
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
import { ICHD } from '../models';
import { Area, Region } from '@/apps/geodata/models';
// import {FilterMatchMode} from 'primevue/api';
const ichd = new ICHD()
const region = new Region()
const area = new Area()

export default {
    name: 'AreaCriteriaDataTableView',
    components: {BackOrStart},
    props: ['area_id'],
    data() {
      return {
        data: [],
        criteria: {},
        region: {},
        area: {},
        columns: [],
        filters: {},
        not_filterable_columns: [1, 2, 3, 4, 5]
      }
    },
    async mounted() {
        this.data = await ichd.criteria_uploads.data_table.list({upload: this.$route.query.file, criteria: this.$route.query.inner_criteria, area: this.area_id})
        const columns = {}
        for (let criteria_data of this.data) {
            for (let col of criteria_data.rows) {
                if (!columns[col.column.id]) {
                    columns[col.column.id] = col.column
                }
            }  
        }
        this.columns = columns
        this.criteria = await ichd.criteria.get(this.$route.query.inner_criteria)
        this.area = await area.get(this.area_id)
        this.region = await region.get(this.$route.query.region)
        store.commit('basic', {key: 'loading', value: false})
    },
    computed: {
        loading: () => store.state.loading,
        width: () => window.innerWidth,
    },
    methods: {
      get_cell(rows, column) {
        for (let row of rows) {
          if (row.column.id === column.id) {
            return row.value
          }
        }
      },
      is_it_filterable(key) {
        return !this.not_filterable_columns.includes(key.id)
      }
    }
}
</script>

<style>

</style>