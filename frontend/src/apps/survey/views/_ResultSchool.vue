<template>
    <TabView @tab-change="change_tab" class="p-0">
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
        return {
            ids: ["203cea56-f2a7-4b9a-9ca6-f79046b84662", "92081a10-f8f1-416e-91be-a9e5138c65bd"],
            results: [],
            loading: true
        }
    },
    async mounted() {
        await this.change_tab({index: 0})
    },
    methods: {
        async change_tab(e) {
            this.loading = true
            const results = await axios.get(`/api/survey/survey-public/${this.ids[e.index]}/result/`)
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
        }
    }
}
</script>