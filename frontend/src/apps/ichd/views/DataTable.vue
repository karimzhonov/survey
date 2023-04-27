<template>
<div v-if="loading" class="layout-main row justify-content-center">
        <div class="col">
                    <ProgressSpinner style="top:30%; left:47%"/>
                </div>
  </div>
  <div v-if="!loading">
    <BackOrStart :header="$t('Махалли')" :navigator="[]" :home_to="{name: 'ichd_main', query: this.$route.query}"/>
    <div class="card mt-3 rounded-4 p-1">
      <div class="col-12">
        <div class="row">
          <div class="col">
            <div>
                <data-table ref="dt" :contextMenu="true" :global-filter-fields="[`area.translations.${$i18n.locale}.name`]" filterDisplay="row" v-model:filters="filters" :value="data" showGridlines :responsiveLayout="width < 960 ? 'stack': 'scroll'">
                <template #header>
                    <div style="text-align: right">
                      <Button icon="pi pi-external-link" class="p-button-success" :label="$t('Скачать Excel')" @click="exportExcel"/> 
                    </div>
                </template>
                  <column sortField="order" :sortable="true" field="order" :header="$t('Место')">
                  <template #body="slotProps">
                    <div>{{ slotProps.data.order = data.indexOf(slotProps.data) + 1}}</div>
                  </template>
                </column>
                <column :sortField="`area.sector.translations.${$i18n.locale}.name`" :sortable="true" field="area.sector" :header="$t('Сектор')" :showFilterMenu="false">
                  <template #filter="{filterModel,filterCallback}">
                        <MultiSelect v-model="filterModel.value" :options="sector_list" @change="filterCallback" 
                         :optionLabel="`translations.${$i18n.locale}.name`" :placeholder="$t('Выберите сектор')" class="p-column-filter">
                            <template #option="slotProps">
                              <span class="image-text">{{slotProps.option.translations[$i18n.locale].name}}</span>
                            </template>
                        </MultiSelect>
                    </template>
                  <template #body="slotProps">
                    <div>{{ slotProps.data.area.sector.translations[$i18n.locale].name }}</div>
                  </template>
                </column>
                <column :sortField="`area.region.translations.${$i18n.locale}.name`" :sortable="true" field="area.region" :header="$t('Район')" :showFilterMenu="false">
                  <template #body="slotProps">
                    <div>{{ slotProps.data.area.region.translations[$i18n.locale].name}}</div>
                  </template>
                  <template #filter="{filterModel, filterCallback}">
                        <MultiSelect v-model="filterModel.value" :options="region_list" @change="filterCallback()" :optionLabel="`translations.${$i18n.locale}.name`" :placeholder="$t('Выберите регион')" class="p-column-filter">
                            <template #option="slotProps">
                              <span class="image-text">{{slotProps.option.translations[$i18n.locale].name}}</span>
                            </template>
                        </MultiSelect>
                    </template>
                </column>
                <column :sortField="`area.translations.${$i18n.locale}.name`" :sortable="true" field="area" :header="$t('Махалля')" :showFilterMenu="false">
                  <template #body="slotProps">
                    <div>{{ slotProps.data.area.translations[$i18n.locale].name}}</div>
                  </template>
                  <template #filter>
                        <InputText type="text" v-model="filters['global'].value" class="p-column-filter" :placeholder="$t('Поиск по махаллям')"/>
                    </template>
                </column>
                <column :sortable="true" field="index" :header="$t('ИЧД')" :showFilterMenu="false" :showClearButton="false" :showFilterMatchModes="false">
                  <template #body="slotProps">
                    <div>{{ slotProps.data.index}}</div>
                  </template>
                </column>
              </data-table>
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
import {FilterMatchMode} from 'primevue/api';
import exportFromJSON from "export-from-json";
import { ICHD } from '../models';
import { Sector, Region } from '@/apps/geodata/models';
const sector = new Sector()
const region = new Region()
const ichd = new ICHD()

export default {
    name: 'DataTableView',
    components: {BackOrStart},
    async mounted() {
      const index_range_list = {
        'red': [0, 0.55],
        'blue': [0.55, 0.65],
        'green': [0.65, 1.00]
      }
      // Init sector filter
      const sectors = await sector.list()
      const sectors_id_list = this.$route.query.sector ? this.$route.query.sector.split(',').reduce((a, v) => [...a, parseInt(v)], []) : []
      const filter_sector = []
      for (let sector of sectors) {
        if (sectors_id_list.includes(sector.id)) {
          filter_sector.push(sector)
        }
      }
      this.sector_list = sectors
      this.filters['area.sector'].value = filter_sector.length > 0 ? filter_sector : null
      // Init region filter
      this.region_list = await region.list()
      this.data = await ichd.area.list({
        upload: this.$route.query.file, 
        index_range: index_range_list[this.$route.query.index_color].join(','), 
      })
      store.commit('basic', {key: 'loading', value: false})
    },
    data() {
      return {
        filters: {
          'area.sector': {value: null, matchMode: FilterMatchMode.IN}, 
          'area.region': {value: null, matchMode: FilterMatchMode.IN}, 
          'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
        },
        data: [],
        sector_list: [],
        region_list: [],
      }
    },
    computed: {
        loading: () => store.state.loading,
        width: () => window.innerWidth
    },
    methods: {
      exportExcel() {
        const data = []
        for (let row of this.$refs.dt.processedData) {
          const row_excel = {}
          row_excel[`${this.$t('Место')}`] = row.order
          row_excel[`${this.$t('Сектор')}`] = row.area.sector.translations[this.$i18n.locale].name
          row_excel[`${this.$t('Район')}`] = row.area.region.translations[this.$i18n.locale].name
          row_excel[`${this.$t('Махалла')}`] = row.area.translations[this.$i18n.locale].name
          row_excel[`${this.$t('ИЧД')}`] = row.index
          data.push(row_excel)
        }
        console.log(data)
        exportFromJSON({data: data, fileName: `ICHD`, exportType: exportFromJSON.types.xls})
      }
    }
}
</script>