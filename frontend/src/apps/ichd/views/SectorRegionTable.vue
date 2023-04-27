<template>
  <div v-if="loading" class="layout-main row justify-content-center">
        <div class="col">
                    <ProgressSpinner style="top:30%; left:47%"/>
                </div>
  </div>
  <div v-if="!loading">
    <BackOrStart :header="`${$t('Районы')} (${$t(criteria.translations[$i18n.locale].name)})`" :navigator="[
        {label: region.translations[$i18n.locale].name, to: {name: 'region_id_sector', params: {region_id: region.id}, query: $route.query}},
    ]" :home_to="{name: 'ichd_main', query: this.$route.query}"/>
    <div class="card mt-3 rounded-4 p-1">
      <div class="col-12">
        <div class="row">
          <div class="col">
            <div>
                <DataTable ref="dt" :value="sectors" showGridlines :responsiveLayout="width < 960 ? 'stack': 'scroll'">
                  <template #header>
                      <div style="text-align: right">
                        <Button icon="pi pi-external-link" class="p-button-success" :label="$t('Скачать Excel')" @click="exportExcel"/> 
                      </div>
                  </template>
                    <Column field="sector" :header="width < 960 ? $t('Сектор') : null">
                      <template #header>
                        <p style="font-size: 1.5rem;" class="text-center m-auto">{{ $t('Сектор') }}</p>
                      </template>
                      <template #body="slotProps">
                        <p class="text-center cursor-pointer" style="font-size: 1.3rem" @click="async () => await row_click(slotProps.data.id)">{{ $t(slotProps.data.translations[$i18n.locale].name) }}</p>
                    </template>
                    </Column>
                    <Column v-for="(col, i) in criteriaes" :key="i" :field="col.translations[$i18n.locale].name" :header="width < 960 ? $t(col.translations[$i18n.locale].name) : null">
                      <template #header v-if="width > 960">
                        <p class="text-center m-auto" style="font-size: 1.3rem">{{ $t(col.translations[$i18n.locale].name) }}</p>
                      </template>
                    <template #body="slotProps">
                      <p class="text-center cursor-pointer" style="font-size: 1.5rem" @click="async () => await row_click(slotProps.data.id)">
                            {{ get_cell(slotProps.data, col, data) }}
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
import { Region, Sector } from '@/apps/geodata/models';
import { ICHD } from '../models';

const ichd = new ICHD()
const region = new Region()
const sector = new Sector()

export default {
    name: 'SectorDataTableView',
    components: {BackOrStart},
    data() {
      return {
        sectors: [],
        criteria: {},
        criteriaes: [],
        data: [],
        region: {},
      }
    },
    async mounted() {
      this.sectors = await sector.list()
      this.region = await region.get(this.$route.query.region)
      this.data = await ichd.region_sector.table.list({upload: this.$route.query.file, category: this.$route.query.criteria, region: this.$route.query.region})
      this.criteria = await ichd.category.get(this.$route.query.criteria)
      this.criteriaes = await ichd.criteria.list({category: this.$route.query.criteria})
      store.commit('basic', {key: 'loading', value: false})
    },
    methods: {
      async row_click(sector_id) {
        await this.$router.push({'name': 'ichd_area-data-table', query: {...this.$route.query, sector: sector_id}})
      },
      exportExcel() {
        const data = []
        for (let row of this.regions) {
          const row_excel = {}
          row_excel[`${this.$t('Район')}`] = row.translations[this.$i18n.locale].name
          for (let d of this.data) {
            if (d.region.id === row.id) {
              row_excel[d.criteria.translations[this.$i18n.locale].name] = Math.round(d.value * 1000) / 1000
            }
          }
          data.push(row_excel)
        }
        exportFromJSON({data: data, fileName: `${this.$t('Районы')} (${this.criteria.translations[this.$i18n.locale].name})`, exportType: exportFromJSON.types.xls})
      },
      get_cell(sector, criteria, data) {
        if (data) {
          for (let d of data) {
            if (sector.id == d.sector.id && criteria.id == d.criteria.id) {
              return d.value
            }
          }
        }

      }
    },
    computed: {
        loading: () => store.state.loading,
        width: () => window.innerWidth,
    }
}
</script>