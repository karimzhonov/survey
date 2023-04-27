<template>
<div v-if="loading" class="layout-main row justify-content-center">
    <div class="col">
        <ProgressSpinner style="top:30%; left:47%"/>
    </div>
</div>
<div v-if="!loading">
    <div class="row justify-contet-between">
        <div class="col-lg-10 col-6">
            <BackOrStart :navigator="[]" :home_to="{name: 'passport_main', query: this.$route.query}"/>
        </div>
        <div class="col-lg-2 col-6 d-flex justify-content-center pl-0 pr-0">
            <Button style="width: 100%" icon="pi pi-file-pdf" class="p-button-danger mr-2 ml-2" :label="$t('Скачать')" @click="generateReport"/>
        </div>
    </div>
    <vue3-html2pdf
        :show-layout="false"
        :float-layout="true"
        :enable-download="true"
        :preview-modal="true"
        :paginate-elements-by-height="3600"
        :filename="region.translations ? region.translations[$i18n.locale].name: 'pdf'"
        :pdf-quality="2"
        :manual-pagination="false"
        pdf-format="a4"
        pdf-orientation="portrait"
        ref="html2Pdf"
    >
    <template v-slot:pdf-content>    
        <RegionPassport :region_id="region_id" :styles="{
            h1: 'font-size: 1.1rem; color: black!important',
            h2: 'font-size: 0.9rem; margin-bottom: 0.2rem; color: black!important',
            card: 'font-size: 0.7rem; border-radius: 0!important; padding: 0 2rem 1.7rem 2rem; background-color: white!important',
            divider: false,
            col_6: 'padding: 0.5rem; color: black!important',
            p: 'color: black!important',
        }" :file="$route.query.file"/>
    </template>
    </vue3-html2pdf>
    <div style="width: 100%">    
        <RegionPassport :region_id="region_id" :styles="{
            card: 'font-size: 1.5rem'
        }" :file="$route.query.file"/>
    </div>
</div>
</template>
<script>
import RegionPassport from '@/components/RegionPassport.vue';
import BackOrStart from '@/components/BackOrStart.vue';
import store from '@/store';
import Vue3Html2pdf from 'vue3-html2pdf'
import { Region } from '@/apps/geodata/models';

export default {
    name: 'RegionDataView',
    props: ['region_id'],
    components: {BackOrStart, RegionPassport, Vue3Html2pdf},
    data() {
        return {
            region: {},
        }
    },
    async mounted() {
        const region = new Region()
        this.region = await region.get(this.region_id)
        // store.commit('basic', {key: 'loading', value: false})    
    },  
    computed: {
        loading: () => store.state.loading
    },
    methods: {
        async generateReport () {
            this.$refs.html2Pdf.generatePdf()
        },
    }
}
</script>