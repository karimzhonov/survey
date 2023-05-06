<template>
    <Toolbar class="mb-4">
            <template #start>
                <span class="p-input-icon-left">
                    <label for="start_date">{{ $t("Дата начало") }}</label>
                    <Calendar class="ml-2" v-model="dates[0]" :manualInput="false" showTime hourFormat="24" dateFormat="dd.mm.yy"
                    @date-select="change_dates" id="start_date"/>
                </span>
                <span class="p-input-icon-left ml-2">
                    <label for="end_date">{{ $t("Дата конец") }}</label>
                    <Calendar class="ml-2" v-model="dates[1]" :manualInput="false" showTime hourFormat="24" dateFormat="dd.mm.yy"
                    @date-select="change_dates" id="end_date"/>
                </span>
            </template>
            <template #end>
                <span class="p-input-icon-left mr-2">
                    <i class="pi pi-search" />
                    <InputText v-model="filters['global'].value" placeholder="Поиск" />
                </span>
            </template>
        </Toolbar>
    
    <DataTable v-model:filters="filters" :value="results" showGridlines responsiveLayout="scroll" :globalFilterFields="['school']" :loading="loading">
        <Column field="school" :header="$t('Школа')"></Column>
        <Column field="value_9" :header="$t('9-класс')"></Column>
        <Column field="value_11" :header="$t('11-класс')"></Column>
        <Column field="sum" :header="$t('Общий')"></Column>
    </DataTable>
</template>
<script>
import axios from '@/plugins/axios';
import { FilterMatchMode } from 'primevue/api';

export default {
    name: "_ResultSchool",
    data() {
        let now = new Date()
        const dates = [new Date(now.getFullYear(), now.getMonth(), now.getDay(), 0, 0, 0), new Date(now.getFullYear(), now.getMonth(), now.getDay(), 23, 59, 59)]
        return {
            ids: ["92081a10-f8f1-416e-91be-a9e5138c65bd", "203cea56-f2a7-4b9a-9ca6-f79046b84662"],
            results: [],
            loading: true,
            dates,
            active: 0,
            filters: {global: { value: null, matchMode: FilterMatchMode.CONTAINS }}
        }
    },
    async mounted() {
        await this.change_tab()
    },
    methods: {
        async change_tab() {
            this.loading = true
            const results_9 = await axios.get(`/api/survey/survey-public/${this.ids[0]}/result/`, {params: {...this.dates_to_iso_dict(this.dates)}})
            const results_11 = await axios.get(`/api/survey/survey-public/${this.ids[1]}/result/`, {params: {...this.dates_to_iso_dict(this.dates)}})
            const school_results = {}
            for (let r of results_9.data) {
                if (school_results[Object.values(r.data)[1]]) {
                    school_results[Object.values(r.data)[1]].value_9 += 1
                } else {
                    school_results[Object.values(r.data)[1]] = {
                        value_11: 0,
                        value_9: 1
                    }
                }
            }

            for (let r of results_11.data) {
                if (school_results[Object.values(r.data)[1]]) {
                    school_results[Object.values(r.data)[1]].value_11 += 1
                } else {
                    school_results[Object.values(r.data)[1]] = {
                        value_11: 1,
                        value_9: 0
                    }
                }
            }

            const ordered = Object.keys(school_results).sort().reduce((obj, key) => { 
                obj.push({"school": key, ...school_results[key], sum: school_results[key].value_11 + school_results[key].value_9})
                return obj;
            }, []);
            this.results = ordered
            this.loading = false
        },
        async change_dates() {
            if (this.dates[1]) {
                await this.change_tab({index: this.active})

            }
        },
        dates_to_iso_dict(dates) {
            const new_dates = [
                new Date(dates[0].getFullYear(), dates[0].getMonth(), dates[0].getDay(), dates[0].getHours() + 5, dates[0].getMinutes(), 0), 
                new Date(dates[1].getFullYear(), dates[1].getMonth(), dates[1].getDay(), dates[1].getHours() + 5, dates[1].getMinutes(), 0)
            ]
            return {
                date__gte: new_dates[0].toISOString({timezone: "UTC"}).slice(0, 19), date__lte: new_dates[1].toISOString().slice(0, 19)
            }
        }
    }
}
</script>