<template>
    <div v-if="loading" class="layout-main row justify-content-center">
    <div class="col">
        <ProgressSpinner style="top:30%; left:47%"/>
    </div>
</div>
<div v-if="!loading" class="fullscreen" style="background-color: var(--bs-body-bg); min-height: 300px;">
    <Carousel :showIndicators="false" :value="uploads" :numVisible="4" :numScroll="4" class="mb-3">
        <template #item="slotProps">
            <div class="card p-3 m-2 cursor-pointer" @click="() => tab_mounted(slotProps.data)">
                <p>{{ slotProps.data.period.translations[$i18n.locale].name }}</p>
            </div>
        </template>
    </Carousel>
    <div v-if="local_loading" class="layout-main row justify-content-center">
        <div class="col">
            <ProgressSpinner style="top:30%; left:47%"/>
        </div>
    </div>
    <TabView v-if="!local_loading" v-model:activeIndex="active">
        <TabPanel v-for="upload in uploads" :key="upload.id">
            <div class="row" style="align-items: center;">
                <div class="col-6">
                    <h3 class="text-center">{{ upload.period.translations[$i18n.locale].name }}</h3>
                </div>
                <div class="col-6 flex justify-content-end">
                    <Button width="100" class="p-button-success m-2" icon="pi pi-file-excel" :label="$t('Скачать экземпляр')" @click="() => download_excel(upload)"/>
                    <FileUpload class="m-2" :disabled="['showing'].includes(upload.status) || uploading" 
                    mode="basic" :auto="true" width="100" name="upload_excel" 
                    customUpload accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
                    @select="(e) => upload_excel(e, upload)" :chooseLabel="$t('Загрузить Excel')" 
                    :uploadIcon="uploading ? 'pi pi-spin pi-spinner' : 'pi pi-upload'"
                    />
                    <Button width="100" class="p-button-warning m-2" icon="pi pi-table" :label="$t('Полноекранний режим')" @click="fullacreen_mode"/>
                </div>
            </div>
            <DataTable :value="areas" showGridlines responsiveLayout="scroll">
                <Column field="id" :header="$t('Махалла ид')">
                  <template #body="slotProps">
                    <div style="width: 100px">{{ slotProps.data.id }}</div>
                  </template>
                </Column>
                <Column field="sector" :header="$t('Сектор')">
                  <template #body="slotProps">
                    <div style="width: 80px">{{ slotProps.data.sector.translations[$i18n.locale].name }}</div>
                  </template>
                </Column>
                <Column field="region" :header="$t('Район')">
                  <template #body="slotProps">
                    <div>{{ slotProps.data.region.translations[$i18n.locale].name }}</div>
                  </template>
                </Column>
                <Column field="area" :header="$t('Махалла')">
                  <template #body="slotProps">
                    <div>{{ slotProps.data.translations[$i18n.locale].name }}</div>
                  </template>
                </Column>
                <Column field="criteria" :header="criteria.translations[$i18n.locale].name" v-for="criteria in criteriies" :key="criteria.id">
                  <template  #body="slotProps">
                    <span class="p-input-icon-right">
                        <i v-if="data[`${slotProps.data.id}-${criteria.id}-${upload.id}`].errors" 
                        class="pi pi-info-circle" style="color: #e24c4c" v-tooltip="$t(data[`${slotProps.data.id}-${criteria.id}-${upload.id}`].errors.join('. '))"/>
                        <InputText type="number" :disabled="['showing'].includes(upload.status) || uploading" 
                        :class="{'p-invalid': data[`${slotProps.data.id}-${criteria.id}-${upload.id}`].errors}"  
                        :value="data[`${slotProps.data.id}-${criteria.id}-${upload.id}`].value" @update:modelValue="(v) => change_value(v, slotProps.data, criteria, upload)"/>
                    </span>
                  </template>
                </Column>
              </DataTable>
        </TabPanel>
    </TabView>
    </div>
</template>
<script>
import store from '@/store';
import { ICHD, IchdUploader } from '../models';
import { Geodata } from '@/apps/geodata/models';
const ichd = new ICHD()
const ichd_uploader = new IchdUploader()
const geodata = new Geodata()

function openFullscreen() {
    const elem = document.querySelector('.fullscreen')
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
}

function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE/Edge */
    document.msExitFullscreen();
  }
}

export default {
    name: "Uplaoder",
    data() {
        return {
            uploads: [],
            active: 0,
            user: null,
            areas: [],
            criteriies: [],
            data: {},
            local_loading: true,
            uploading: false,
            fullscreen: false
        }
    },
    async mounted() {
        try {
            this.user = await ichd_uploader.user.get()
            this.uploads = await ichd.upload.list({'all': true})
            this.areas = await geodata.area.list({id: this.user.areas.join(","), ordering: "id"})
            this.criteriies = await ichd.criteria.list({id: this.user.criterias.join(","), ordering: "id"})
            for (let a of this.areas) {
                for (let c of this.criteriies) {
                    for (let u of this.uploads) {
                        this.data[`${a.id}-${c.id}-${u.id}`] = {}
                    }
                }
            }
            await this.tab_mounted(this.uploads[this.active])
            store.commit('basic', {key: 'loading', value: false})
        } catch (e) {
            console.log(e);
            this.$route.push({name: "ichd"})
        }
    },
    methods: {
        fullacreen_mode() {
            if (this.fullscreen) {
                closeFullscreen()
            } else {
                openFullscreen()
            }
            this.fullscreen = !this.fullscreen
        },
        async download_excel(upload){
            const excel = await ichd_uploader.excel.get_instance({lang: this.$i18n.locale})
            const url = URL.createObjectURL(new Blob([excel], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            }))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `${upload.period.translations[this.$i18n.locale].name}.xlsx`)
            document.body.appendChild(link)
            link.click()
        },
        async upload_excel(e, upload) {
          this.uploading = true
            const formData = new FormData()
            formData.append('xlsx', e.files[0])
            formData.append('upload', upload.id)
            const data = await ichd_uploader.excel.post_instance(formData)
            for (let d of data.data) {
                this.data[`${d.area.id}-${d.criteria.id}-${upload.id}`] = d
            }
            if (data.error.length > 0) {
              store.dispatch("add_error_message", data.error.join(". "))
            }
            this.uploading = false
        },
        async change_value(value, area, criteria, upload){
            const data = await ichd_uploader.excel.change(
                {
                    area: area.id, criteria: criteria.id, upload: upload.id, value: value
                }
            )
            this.data[`${area.id}-${criteria.id}-${upload.id}`] = data
        },
        async tab_mounted(upload) {
            this.local_loading = true
            this.active = this.uploads.indexOf(upload)
            const data = await ichd.area.table.list({area: this.user.areas.join(","), criteria: this.user.criterias.join(","), upload: upload.id})
            for (let d of data) {
                if (d.value) {
                    d.value = d.value.replace(/\s/g, '')
                }
                this.data[`${d.area.id}-${d.criteria.id}-${upload.id}`] = d
            } 
            this.local_loading = false
        }
    },
    computed: {
        loading: () => store.state.loading
    }
}
</script>
<style>
.p-tabview-nav-container {
    display: none;
}
.fullscreen:fullscreen {
  overflow: scroll !important;
}
.fullscreen:-ms-fullscreen {
  overflow: scroll !important;
}
.fullscreen:-webkit-full-screen {
  overflow: scroll !important;
}
.fullscreen:-moz-full-screen {
  overflow: scroll !important;
}
</style>