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
                <div style="text-align: right">
                    <Button icon="pi pi-external-link" class="p-button-success" :label="$t('Скачать Excel')" @click="exportExcel"/> 
                </div>
            </template>
        </Toolbar>
    
    <DataTable :value="results" showGridlines responsiveLayout="scroll" :loading="loading" v-model:expandedRows="expandedRows">
        <Column expander style="width: 5rem" />
        <Column field="region" :header="$t('Район')"></Column>
        <Column field="survey_count" :header="$t('Участвовали')"></Column>
        <Column field="school_count" :header="$t('Кол-во школ')"></Column>
        <Column field="count_per" :header="$t('Школа, Охват (%)')"></Column>
        <Column field="value_9" :header="$t('9-класс, Численость')"></Column>
        <Column field="v_9" :header="$t('9-класс, Участвовали')"></Column>
        <Column field="v_9_per" :header="$t('9-класс, Охват (%)')"></Column>
        <Column field="value_11" :header="$t('11-класс, Численость')"></Column>
        <Column field="v_11" :header="$t('11-класс, Участвовали')"></Column>
        <Column field="v_11_per" :header="$t('11-класс, Охват (%)')"></Column>
        <Column field="summa" :header="$t('Итог, Численость')"></Column>
        <Column field="sum" :header="$t('Итог, Участвовали')"></Column>
        <Column field="sum_per" :header="$t('Итог, Охват (%)')"></Column>
        <ColumnGroup type="footer">
            <Row>
                <Column></Column>
                <Column footer="Общий результат"></Column>
                <Column :footer="all.survey_count"></Column>
                <Column :footer="all.school_count"></Column>
                <Column :footer="all.count_per"></Column>
                <Column :footer="all.value_9"></Column>
                <Column :footer="all.v_9"></Column>
                <Column :footer="`${all.v_9_per}`"></Column>
                <Column :footer="all.value_11"></Column>
                <Column :footer="all.v_11"></Column>
                <Column :footer="`${all.v_11_per}`"></Column>
                <Column :footer="all.summa"></Column>
                <Column :footer="all.sum"></Column>
                <Column :footer="`${all.sum_per}`"></Column>
            </Row>
            <Row>
                <Column></Column>
                <Column footer="Общий итог"></Column>
                <Column :footer="all_all.survey_count"></Column>
                <Column :footer="all_all.school_count"></Column>
                <Column :footer="all_all.count_per"></Column>
                <Column :footer="all_all.value_9"></Column>
                <Column :footer="all_all.v_9"></Column>
                <Column :footer="`${all_all.v_9_per}`"></Column>
                <Column :footer="all_all.value_11"></Column>
                <Column :footer="all_all.v_11"></Column>
                <Column :footer="`${all_all.v_11_per}`"></Column>
                <Column :footer="all_all.summa"></Column>
                <Column :footer="all_all.sum"></Column>
                <Column :footer="`${all_all.sum_per}`"></Column>
            </Row>
        </ColumnGroup>
        <template #expansion="slotProps">
            <div class="p-3">
                <div class="flex justify-content-between">
                    <h5>Школы - {{ slotProps.data.region }}</h5>
                    <span class="p-input-icon-left mr-2">
                        <i class="pi pi-search" />
                        <InputText v-model="filters[slotProps.data.region]['global'].value" placeholder="Поиск" />
                    </span>
                </div>
                

                <DataTable :value="slotProps.data.schools" v-model:filters="filters[slotProps.data.region]" showGridlines responsiveLayout="scroll" :globalFilterFields="['school']">
                    <Column field="school" :header="$t('Школа')"></Column>
                    <Column field="value_9" :header="$t('9-класс, Численость')"></Column>
                    <Column field="v_9" :header="$t('9-класс, Участвовали')"></Column>
                    <Column field="v_9_per" :header="$t('9-класс, Охват (%)')"></Column>
                    <Column field="value_11" :header="$t('11-класс, Численость')"></Column>
                    <Column field="v_11" :header="$t('11-класс, Участвовали')"></Column>
                    <Column field="v_11_per" :header="$t('11-класс, Охват (%)')"></Column>
                    <Column field="summa" :header="$t('Итог, Численость')"></Column>
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
import exportFromJSON from "export-from-json";

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
            all: {},
            all_all: {}
        }
    },
    async mounted() {
        await this.change_tab(this.dates)
    },
    methods: {
        get_school(data) {
            for (let i=1; i++; i < 14) {
                const school = data[`вопрос${i}`]
                if (school) return school
            }
            return ""
        },
        async change_tab(dates) {
            let plan_ = await fetch("/json/schools.json")
            plan_ = await plan_.json()
            delete plan_["NaN"]
            this.loading = true
            const results_9 = await axios.get(`/api/survey/survey-public/${this.ids[0]}/result/`, {params: {...this.dates_to_iso_dict(dates)}})
            const results_11 = await axios.get(`/api/survey/survey-public/${this.ids[1]}/result/`, {params: {...this.dates_to_iso_dict(dates)}})
            const plan = {}
            result: for (let r of results_9.data) {
                for (let region in plan_) {
                    for (let school in plan_[region]) {
                        if (
                            school == this.get_school(r.data) || 
                            school == this.get_school(r.data).replace("-мактаб", "") ||
                            school == this.get_school(r.data).replace("мактаб", "") ||
                            school == this.get_school(r.data).replace(" мактаб", "") ||
                            school == this.get_school(r.data).replace("-", " ") ||

                            school.replace("-мактаб", "") == this.get_school(r.data) ||
                            school.replace("мактаб", "") == this.get_school(r.data) ||
                            school.replace(" мактаб", "") == this.get_school(r.data) ||

                            school.replace("-maktab", "") == this.get_school(r.data) ||
                            school.replace("maktab", "") == this.get_school(r.data) ||
                            school.replace(" maktab", "") == this.get_school(r.data)
                        ) {
                            if (!plan[region]) {
                                plan[region] = {}
                            }
                            if (plan[region][school]) {
                                plan[region][school]["v_9"] += 1
                            } else {
                                plan[region][school] = {v_9: 1, v_11: 0, ...plan_[region][school]}
                            }
                            continue result
                        }
                    }
                }
            }

            result: for (let r of results_11.data) {
                for (let region in plan_) {
                    for (let school in plan_[region]) {
                        if (                            
                            school == this.get_school(r.data) || 
                            school == this.get_school(r.data).replace("-мактаб", "") ||
                            school == this.get_school(r.data).replace("мактаб", "") ||
                            school == this.get_school(r.data).replace(" мактаб", "") ||
                            school == this.get_school(r.data).replace("-", " ") ||

                            school.replace("-мактаб", "") == this.get_school(r.data) ||
                            school.replace("мактаб", "") == this.get_school(r.data) ||
                            school.replace(" мактаб", "") == this.get_school(r.data) ||

                            school.replace("-maktab", "") == this.get_school(r.data) ||
                            school.replace("maktab", "") == this.get_school(r.data) ||
                            school.replace(" maktab", "") == this.get_school(r.data)
                        ) {
                            if (!plan[region]) {
                                plan[region] = {}
                            }
                            if (plan[region][school]) {
                                plan[region][school]["v_11"] += 1
                            } else {
                                plan[region][school] = {v_9: 0, v_11: 1, ...plan_[region][school]}
                            }
                            continue result
                        }
                    }
                }
            }
            const ordered = Object.keys(plan).sort().reduce((obj, key) => { 
                this.filters[key] = {global: { value: null, matchMode: FilterMatchMode.CONTAINS }}
                const d = {
                    "region": key, 
                    "schools": Object.keys(plan[key]).sort().reduce((acc, school) => {
                        const d = {
                            "school": school, ...plan[key][school],
                        }
                        d.v_9_per = `${d.v_9 ? Math.round(d.v_9 / d.value_9 * 10000) / 100 : ""}%`
                        d.v_11_per = `${d.v_11 ? Math.round(d.v_11 / d.value_11 * 10000) / 100 : ""}%`
                        d.summa = d.value_9 + d.value_11
                        d.sum = (d.v_9 ? d.v_9 : 0) + (d.v_11 ? d.v_11 : 0)
                        d.sum = d.sum ? d.sum : ""
                        d.sum_per = `${d.sum ? Math.round(d.sum / d.summa * 10000) / 100 : ""}%`
                        acc.push(d)
                        return acc
                    }, []),
                    v_9: Object.values(plan[key]).reduce((a, v) => {a += v.v_9 ?? 0; return a}, 0),
                    value_9: Object.values(plan[key]).reduce((a, v) => {a += v.value_9 ?? 0; return a}, 0),
                    v_11: Object.values(plan[key]).reduce((a, v) => {a += v.v_11 ?? 0; return a}, 0),
                    value_11: Object.values(plan[key]).reduce((a, v) => {a += v.value_11 ?? 0; return a}, 0),
                } 
                d.school_count = Object.keys(plan_[key]).length
                d.survey_count = d.schools.reduce((a, v) => {a += v.v_9 + v.v_11 > 10 ? 1 : 0; return a}, 0)
                d.count_per = `${d.survey_count ? Math.round(d.survey_count / d.school_count * 10000) / 100 : ""}%`
                d.v_9_per = `${d.v_9 ? Math.round(d.v_9 / d.value_9 * 10000) / 100 : ""}%`
                d.v_11_per = `${d.v_11 ? Math.round(d.v_11 / d.value_11 * 10000) / 100 : ""}%`
                d.summa = d.value_9 + d.value_11
                d.sum = (d.v_9 ? d.v_9 : 0) + (d.v_11 ? d.v_11 : 0)
                d.sum = d.sum ? d.sum : ""
                d.sum_per = `${d.sum ? Math.round(d.sum / d.summa * 10000) / 100 : ""}%`
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
            all.v_9_per = `${all.v_9 ? Math.round(all.v_9 / all.value_9 * 10000) / 100 : ""}%`
            all.v_11_per = `${all.v_11 ? Math.round(all.v_11 / all.value_11 * 10000) / 100 : ""}%`
            all.school_count = ordered.reduce((a, v) => {a += v.school_count; return a}, 0)
            all.survey_count = ordered.reduce((a, v) => {a += v.survey_count; return a}, 0)
            all.count_per = `${all.survey_count ? Math.round(all.survey_count / all.school_count * 10000) / 100 : ""}%`
            all.summa = all.value_9 + all.value_11
            all.sum = (all.v_9 ? all.v_9 : 0) + (all.v_11 ? all.v_11 : 0)
            all.sum = all.sum ? all.sum : ""
            all.sum_per = `${all.sum ? Math.round(all.sum / all.summa * 10000) / 100 : ""}%`
            this.all = all

            const all_all = JSON.parse(JSON.stringify(all))
            all_all.school_count = Object.values(plan_).reduce((a, v) => {a += Object.keys(v).length; return a}, 0)
            all_all.count_per = `${all_all.survey_count ? Math.round(all_all.survey_count / all_all.school_count * 10000) / 100 : ""}%`
            all_all.value_9 = Object.values(plan_).reduce((a, v)=> {a += Object.values(v).reduce((aa, vv) => {aa+= vv.value_9; return aa}, 0); return a}, 0)
            all_all.value_11 = Object.values(plan_).reduce((a, v)=> {a += Object.values(v).reduce((aa, vv) => {aa+= vv.value_11; return aa}, 0); return a}, 0)
            all_all.summa = all_all.value_9 + all_all.value_11
            all_all.v_9_per = `${all_all.v_9 ? Math.round(all_all.v_9 / all_all.value_9 * 10000) / 100 : ""}%`
            all_all.v_11_per = `${all_all.v_11 ? Math.round(all_all.v_11 / all_all.value_11 * 10000) / 100 : ""}%`
            all_all.sum_per = `${all.sum ? Math.round(all_all.sum / all_all.summa * 10000) / 100 : ""}%`
            this.all_all = all_all

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
        },
        exportExcel() {
            const data = []
            for (let region of this.results) {
                for (let school of region.schools) {
                    const row_excel = {}
                    row_excel[`${this.$t('Район')}`] = region.region
                    row_excel[`${this.$t('Школа')}`] = school.school
                    row_excel[`${this.$t('9-класс, Численость')}`] = school.value_9
                    row_excel[`${this.$t('9-класс, Участвовали')}`] = school.v_9
                    row_excel[`${this.$t('9-класс, Охват (%)')}`] = school.v_9_per
                    row_excel[`${this.$t('11-класс, Численость')}`] = school.value_11
                    row_excel[`${this.$t('11-класс, Участвовали')}`] = school.v_11
                    row_excel[`${this.$t('11-класс, Охват (%)')}`] = school.v_11_per
                    row_excel[`${this.$t('Итог, Численость')}`] = school.summa
                    row_excel[`${this.$t('Итог, Участвовали')}`] = school.sum
                    row_excel[`${this.$t('Итог, Охват (%)')}`] = school.sum_per
                    data.push(row_excel)
                }
            }
            let row_excel = {}
            row_excel[`${this.$t('Район')}`] = "Общий результат"
            row_excel[`${this.$t('Школа')}`] = ""
            row_excel[`${this.$t('9-класс, Численость')}`] = this.all.value_9
            row_excel[`${this.$t('9-класс, Участвовали')}`] = this.all.v_9
            row_excel[`${this.$t('9-класс, Охват (%)')}`] = this.all.v_9_per
            row_excel[`${this.$t('11-класс, Численость')}`] = this.all.value_11
            row_excel[`${this.$t('11-класс, Участвовали')}`] = this.all.v_11
            row_excel[`${this.$t('11-класс, Охват (%)')}`] = this.all.v_11_per
            row_excel[`${this.$t('Итог, Численость')}`] = this.all.summa
            row_excel[`${this.$t('Итог, Участвовали')}`] = this.all.sum
            row_excel[`${this.$t('Итог, Охват (%)')}`] = this.all.sum_per
            data.push(JSON.parse(JSON.stringify(row_excel)))
            row_excel = {}
            row_excel[`${this.$t('Район')}`] = "Общий итог"
            row_excel[`${this.$t('Школа')}`] = ""
            row_excel[`${this.$t('9-класс, Численость')}`] = this.all_all.value_9
            row_excel[`${this.$t('9-класс, Участвовали')}`] = this.all_all.v_9
            row_excel[`${this.$t('9-класс, Охват (%)')}`] = this.all_all.v_9_per
            row_excel[`${this.$t('11-класс, Численость')}`] = this.all_all.value_11
            row_excel[`${this.$t('11-класс, Участвовали')}`] = this.all_all.v_11
            row_excel[`${this.$t('11-класс, Охват (%)')}`] = this.all_all.v_11_per
            row_excel[`${this.$t('Итог, Численость')}`] = this.all_all.summa
            row_excel[`${this.$t('Итог, Участвовали')}`] = this.all_all.sum
            row_excel[`${this.$t('Итог, Охват (%)')}`] = this.all_all.sum_per
            data.push(row_excel)
            exportFromJSON({data: data, fileName: `Школа`, exportType: exportFromJSON.types.xls})
        }
    }
}
</script>