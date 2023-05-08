<template>
    <Toolbar>
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
    
    <DataTable v-model:filters="filters" :value="results" showGridlines responsiveLayout="scroll" :globalFilterFields="['school']" :loading="loading" v-model:expandedRows="expandedRows">
        <Column expander style="width: 5rem" />
        <Column field="region" :header="$t('Район')"></Column>
        <Column field="value_9" :header="$t('9-класс, Численнсть')"></Column>
        <Column field="v_9" :header="$t('9-класс, Участвовали')"></Column>
        <Column field="v_9_per" :header="$t('9-класс, Охват (%)')">
            <template #body="slotProps">{{ slotProps.data.v_9_per }} {{ slotProps.data.v_9_per ? "%" : "" }}</template>
        </Column>
        <Column field="value_11" :header="$t('11-класс, Численнсть')"></Column>
        <Column field="v_11" :header="$t('11-класс, Участвовали')"></Column>
        <Column field="v_11_per" :header="$t('11-класс, Охват (%)')">
            <template #body="slotProps">{{ slotProps.data.v_11_per }} {{ slotProps.data.v_11_per ? "%" : "" }}</template>
        </Column>
        <Column field="summa" :header="$t('Итог, Численнсть')"></Column>
        <Column field="sum" :header="$t('Итог, Участвовали')"></Column>
        <Column field="sum_per" :header="$t('Итог, Охват (%)')">
            <template #body="slotProps">{{ slotProps.data.sum_per }} {{ slotProps.data.sum_per ? "%" : "" }}</template>
        </Column>
        <ColumnGroup type="footer">
            <Row>
                <Column></Column>
                <Column :footer="all.region"></Column>
                <Column :footer="all.value_9" :header="$t('11-класс, Численнсть')"></Column>
                <Column :footer="all.v_9" :header="$t('9-класс, Участвовали')"></Column>
                <Column :footer="all.v_9_per" :header="$t('9-класс, Охват (%)')">
                    <template #body="slotProps">{{ slotProps.data.v_9_per }} {{ slotProps.data.v_9_per ? "%" : "" }}</template>
                </Column>
                <Column :footer="all.value_11" :header="$t('11-класс, Численнсть')"></Column>
                <Column :footer="all.v_11" :header="$t('11-класс, Участвовали')"></Column>
                <Column :footer="all.v_11_per" :header="$t('11-класс, Охват (%)')">
                    <template #body="slotProps">{{ slotProps.data.v_11_per }} {{ slotProps.data.v_11_per ? "%" : "" }}</template>
                </Column>
                <Column :footer="all.summa" :header="$t('Итог, Численнсть')"></Column>
                <Column :footer="all.sum" :header="$t('Итог, Участвовали')"></Column>
                <Column :footer="all.sum_per" :header="$t('Итог, Охват (%)')">
                    <template #body="slotProps">{{ slotProps.data.sum_per }} {{ slotProps.data.sum_per ? "%" : "" }}</template>
                </Column>
            </Row>
        </ColumnGroup>
        <template #expansion="slotProps">
            <div class="p-3">
                <h5>Школы - {{ slotProps.data.region }}</h5>
                <DataTable :value="slotProps.data.schools" >
                    <Column field="school" :header="$t('Школа')"></Column>
                    <Column field="value_9" :header="$t('9-класс, Численнсть')"></Column>
                    <Column field="v_9" :header="$t('9-класс, Участвовали')"></Column>
                    <Column field="v_9_per" :header="$t('9-класс, Охват (%)')"></Column>
                    <Column field="value_9" :header="$t('11-класс, Численнсть')"></Column>
                    <Column field="v_9" :header="$t('11-класс, Участвовали')"></Column>
                    <Column field="v_9_per" :header="$t('11-класс, Охват (%)')"></Column>
                    <Column field="summa" :header="$t('Итог, Численнсть')"></Column>
                    <Column field="sum" :header="$t('Итог, Участвовали')"></Column>
                    <Column field="sum_per" :header="$t('Итог, Охват (%)')"></Column>
                </DataTable>
            </div>
        </template>
    </DataTable>
</template>
<script>
import axios from '@/plugins/axios';
import { FilterMatchMode } from 'primevue/api';

export default {
    name: "_ResultSchool",
    data() {
        let now = new Date()
        const dates = [new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0), new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)]
        return {
            ids: ["92081a10-f8f1-416e-91be-a9e5138c65bd", "203cea56-f2a7-4b9a-9ca6-f79046b84662"],
            results: [],
            loading: true,
            dates,
            active: 0,
            filters: {global: { value: null, matchMode: FilterMatchMode.CONTAINS }},
            expandedRows: [],
            all: {}
        }
    },
    async mounted() {
        await this.change_tab(this.dates)
    },
    methods: {
        async change_tab(dates) {
            let plan = await fetch("/json/schools.json")
            plan = await plan.json()
            delete plan["NaN"]
            this.loading = true
            const results_9 = await axios.get(`/api/survey/survey-public/${this.ids[0]}/result/`, {params: {...this.dates_to_iso_dict(dates)}})
            const results_11 = await axios.get(`/api/survey/survey-public/${this.ids[1]}/result/`, {params: {...this.dates_to_iso_dict(dates)}})

            for (let r of results_9.data) {
                for (let region in plan) {
                    for (let school in plan[region]) {
                        if (
                            school == Object.values(r.data)[1] || 
                            school == Object.values(r.data)[1].replace("-мактаб", "") ||
                            school == Object.values(r.data)[1].replace("мактаб", "") ||
                            school == Object.values(r.data)[1].replace(" мактаб", "") ||
                            school == Object.values(r.data)[1].replace("-", " ") ||

                            school.replace("-мактаб", "") == Object.values(r.data)[1] ||
                            school.replace("мактаб", "") == Object.values(r.data)[1] ||
                            school.replace(" мактаб", "") == Object.values(r.data)[1] ||

                            school.replace("-maktab", "") == Object.values(r.data)[1] ||
                            school.replace("maktab", "") == Object.values(r.data)[1] ||
                            school.replace(" maktab", "") == Object.values(r.data)[1]
                        ) {
                            if (plan[region][school]["v_9"]) {
                                plan[region][school]["v_9"] += 1
                            } else {
                                plan[region][school]["v_9"] = 1
                            }
                        }
                    }
                }
            }

            for (let r of results_11.data) {
                for (let region in plan) {
                    for (let school in plan[region]) {
                        if (                            
                            school == Object.values(r.data)[1] || 
                            school == Object.values(r.data)[1].replace("-мактаб", "") ||
                            school == Object.values(r.data)[1].replace("мактаб", "") ||
                            school == Object.values(r.data)[1].replace(" мактаб", "") ||
                            school == Object.values(r.data)[1].replace("-", " ") ||

                            school.replace("-мактаб", "") == Object.values(r.data)[1] ||
                            school.replace("мактаб", "") == Object.values(r.data)[1] ||
                            school.replace(" мактаб", "") == Object.values(r.data)[1] ||

                            school.replace("-maktab", "") == Object.values(r.data)[1] ||
                            school.replace("maktab", "") == Object.values(r.data)[1] ||
                            school.replace(" maktab", "") == Object.values(r.data)[1]
                        ) {
                            if (plan[region][school]["v_11"]) {
                                plan[region][school]["v_11"] += 1
                            } else {
                                plan[region][school]["v_11"] = 1
                            }
                        }
                    }
                }
            }
            const ordered = Object.keys(plan).sort().reduce((obj, key) => { 
                const d = {
                    "region": key, 
                    "schools": Object.keys(plan[key]).sort().reduce((acc, school) => {
                        const d = {
                            "school": school, ...plan[key][school],
                        }
                        d.v_9_per = d.v_9 ? Math.round(d.v_9 / d.value_9 * 10000) / 100 : ""
                        d.v_11_per = d.v_11 ? Math.round(d.v_11 / d.value_11 * 10000) / 100 : ""
                        d.summa = d.value_9 + d.value_11
                        d.sum = d.v_9 ? d.v_9 : 0 + d.v_11 ? d.v_11 : 0
                        d.sum = d.sum ? d.sum : ""
                        d.sum_per = d.sum ? Math.round(d.sum / d.summa * 10000) / 100 : ""
                        acc.push(d)
                        return acc
                    }, []),
                    v_9: Object.values(plan[key]).reduce((a, v) => {a += v.v_9 ?? 0; return a}, 0),
                    value_9: Object.values(plan[key]).reduce((a, v) => {a += v.value_9 ?? 0; return a}, 0),
                    v_11: Object.values(plan[key]).reduce((a, v) => {a += v.v_11 ?? 0; return a}, 0),
                    value_11: Object.values(plan[key]).reduce((a, v) => {a += v.value_11 ?? 0; return a}, 0),
                } 
                d.v_9_per = d.v_9 ? Math.round(d.v_9 / d.value_9 * 10000) / 100 : ""
                d.v_11_per = d.v_11 ? Math.round(d.v_11 / d.value_11 * 10000) / 100 : ""
                d.summa = d.value_9 + d.value_11
                d.sum = d.v_9 ? d.v_9 : 0 + d.v_11 ? d.v_11 : 0
                d.sum = d.sum ? d.sum : ""
                d.sum_per = d.sum ? Math.round(d.sum / d.summa * 10000) / 100 : ""
                obj.push(d)
                return obj;
            }, []);
            const all = {
                region: "Общий итог",
                v_9: Object.values(ordered).reduce((a, v) => {a += v.v_9 ?? 0; return a}, 0),
                value_9: Object.values(ordered).reduce((a, v) => {a += v.value_9 ?? 0; return a}, 0),
                v_11: Object.values(ordered).reduce((a, v) => {a += v.v_11 ?? 0; return a}, 0),
                value_11: Object.values(ordered).reduce((a, v) => {a += v.value_11 ?? 0; return a}, 0),
            }
            all.v_9_per = all.v_9 ? Math.round(all.v_9 / all.value_9 * 10000) / 100 : ""
            all.v_11_per = all.v_11 ? Math.round(all.v_11 / all.value_11 * 10000) / 100 : ""
            all.summa = all.value_9 + all.value_11
            all.sum = (all.v_9 ? all.v_9 : 0) + (all.v_11 ? all.v_11 : 0)
            all.sum = all.sum ? all.sum : ""
            all.sum_per = all.sum ? Math.round(all.sum / all.summa * 10000) / 100 : ""
            this.all = all
            this.results = ordered
            this.loading = false
            
        },
        async change_dates() {
            if (this.dates[1]) {
                await this.change_tab(this.dates)

            }
        },
        dates_to_iso_dict(dates) {
            const new_dates = [
                new Date(dates[0].getFullYear(), dates[0].getMonth(), dates[0].getDate(), dates[0].getHours() + 5, dates[0].getMinutes(), 0), 
                new Date(dates[1].getFullYear(), dates[1].getMonth(), dates[1].getDate(), dates[1].getHours() + 5, dates[1].getMinutes(), 0)
            ]
            return {
                date__gte: new_dates[0].toISOString().slice(0, 19), date__lte: new_dates[1].toISOString().slice(0, 19)
            }
        }
    }
}
</script>