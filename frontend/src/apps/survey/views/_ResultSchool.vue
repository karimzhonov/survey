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
                <Button :label="$t('Таблица резултатов')" text @click="show_table_results"/>
            </template>
        </Toolbar>
    <TabView v-model:activeIndex="active" @tab-change="change_tab" class="p-0">
        <TabPanel header="Класс-9">
            <div v-if="loading" class="layout-main row justify-content-center">
                <div class="col">
                    <ProgressSpinner style="top:30%; left:47%"/>
                </div>
            </div>
            <div v-if="!loading">
                <DataTable :value="results" showGridlines responsiveLayout="scroll">
                    <Column field="school" :header="$t('Школа')"></Column>
                    <Column field="value" :header="$t('Кол-во')"></Column>
                </DataTable>
            </div>
        </TabPanel>
        <TabPanel header="Класс-11">
            <div v-if="loading" class="layout-main row justify-content-center">
                <div class="col">
                    <ProgressSpinner style="top:30%; left:47%"/>
                </div>
            </div>
            <div v-if="!loading">
                <DataTable :value="results" showGridlines responsiveLayout="scroll">
                    <Column field="school" :header="$t('Школа')"></Column>
                    <Column field="value" :header="$t('Кол-во')"></Column>
                </DataTable>
            </div>
        </TabPanel>
    </TabView>
</template>
<script>
import axios from '@/plugins/axios';

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
            active: 0
        }
    },
    async mounted() {
        await this.change_tab({index: 0})
    },
    methods: {
        async change_tab(e) {
            this.loading = true
            const results = await axios.get(`/api/survey/survey-public/${this.ids[e.index]}/result/`, {...this.dates_to_iso_dict(this.dates)})
            const school_results = {}
            for (let r of results.data) {
                if (school_results[Object.values(r.data)[1]]) {
                    school_results[Object.values(r.data)[1]] += 1
                } else {
                    school_results[Object.values(r.data)[1]] = 1
                }
            }
            const ordered = Object.keys(school_results).sort().reduce((obj, key) => { 
                obj.push({"school": key, value: school_results[key]})
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