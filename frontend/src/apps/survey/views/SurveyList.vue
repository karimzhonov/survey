<template>
    <div v-if="loading" class="layout-main row justify-content-center">
        <div class="col">
            <ProgressSpinner style="top:30%; left:47%"/>
        </div>
    </div>
    <div v-if="!loading" class="card mt-5" style="max-width: 1504px; margin-left: auto; margin-right: auto;">
        <h2 class="text-center mb-4">{{ $t("Опросы") }}</h2>
        <Toolbar class="mb-4">
            <template #start>
                <span class="p-input-icon-left">
                    <i class="pi pi-search" />
                    <InputText v-model="filters['global'].value" :placeholder="$t('Поиск')" />
                </span>
            </template>
            <template #end>
                <Button :label="$t('Новый Опрос')" icon="pi pi-plus" class="p-button p-button-success" @click="openNew" />
            </template>
        </Toolbar>
        <DataTable ref="dt" :value="surveys" showGridlines responsiveLayout="stack" v-model:filters="filters" :globalFilterFields="['name']">
            <Column field="title" :header="$t('Название')">
                <template #body="slotProps">
                    <p>{{ $t(slotProps.data.name) }}</p>
                </template>
            </Column>
            <Column field="status" :header="$t('Статус')">
                <template #body="slotProps">
                    <p :style="`color: ${status_color[slotProps.data.status]}`">{{ $t(slotProps.data.status) }}</p>
                </template>
            </Column>
            <Column field="start_date" :header="$t('Дата начало')">
                <template #body="slotProps">
                    <p>{{ slotProps.data.start_date.toISOString() }}</p>
                </template>
            </Column>
            <Column field="end_date" :header="$t('Дата окончание')">
                <template #body="slotProps">
                    <p>{{ slotProps.data.end_date ? slotProps.data.end_date.toISOString() : null }}</p>
                </template>
            </Column>
            <Column style="width: 180px" field="delete_button" :header="$t('')">
                <template #body="slotProps">
                    <div class="flex justify-content-center">
                        <Button class="ml-2" icon="pi pi-chevron-circle-right" @click="() => open_survey_public(slotProps.data.id)" />
                        <Button class="p-button p-button-secondary ml-2" icon="pi pi-cog" @click="survey = slotProps.data; surveyDiolog = true" />
                        <Button class="p-button p-button-help ml-2" icon="pi pi-pencil" @click="async () => await row_click(slotProps.data.id)" />
                        <Button class="p-button p-button-success ml-2" icon="pi pi-chart-line" @click="$router.push({name: 'survey_dashboard', params: {id: slotProps.data.id}})" />
                        <Button class="p-button p-button-danger ml-2" icon="pi pi-trash" @click="deleteSurveysDialog = true;survey=slotProps.data" />
                    </div>
                </template>
            </Column>
        </DataTable>

    </div>
    <Dialog v-model:visible="deleteSurveysDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
        <template #header>
            <h4 class="m-2">{{ $t('Подтверждение') }}</h4>
        </template>
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span>{{ $t("confirm_delete_surveys") }}</span>
        </div>
        <template #footer>
            <div class="mt-3">
                <Button :label="$t('Нет')" icon="pi pi-times" text @click="deleteSurveysDialog = false"/>
                <Button class="p-button p-button-danger" :label="$t('Да')" icon="pi pi-check" text @click="() => deleteSelectedSurveys(this.survey.id)" />
            </div>
            
        </template>
    </Dialog>
    <Dialog v-model:visible="surveyDiolog" :style="{width: '450px'}" :header="$t(`Настройка опроса: ${survey.name}`)" :modal="true" class="p-fluid">
        <div class="field">
            <label for="name">{{ $t("Дата начало") }}</label>
            <Calendar id="calendar-24h" v-model="survey.start_date" showTime hourFormat="24" dateFormat="dd.mm.yy"/>
        </div>
        <div class="field">
            <label for="name">{{ $t("Дата начало") }}</label>
            <Calendar id="calendar-24h" v-model="survey.end_date" showTime hourFormat="24" dateFormat="dd.mm.yy"/>
        </div>

        <div class="field">
            <label for="name">{{ $t("Дата начало") }}</label>
            <Dropdown v-model="survey.status" :options="status_dropdown" :placeholder="$t('Выберите статус')" class="w-full md:w-14rem" />
        </div>

        
        <template #footer>
            <div class="mt-3">
                <Button label="Cancel" icon="pi pi-times" text @click="survey={}; surveyDiolog=false"/>
                <Button class="p-button-success" label="Save" icon="pi pi-check" text @click="save_survey" />
            </div>
        </template>
    </Dialog>
</template>
<script>
import { FilterMatchMode } from 'primevue/api';
import store from '@/store';
import { Survey } from '../models';
const $survey = new Survey()

export default {
    name: "SurveyList",
    data() {
        return {
            survey: {},
            surveys: [],
            surveys_params: {},
            selectedSurveys: [],
            deleteSurveysDialog: false,
            surveyDiolog: false,
            filters: {global: { value: null, matchMode: FilterMatchMode.CONTAINS },},
            status_color: {
                "draft": "#828282",
                "active": "#4ec775",
                "pause": "#ffb258",
                "finished": "#EF4444",
                "closed": "#EF4444"
            },
            status_dropdown: [
                "draft", "active", "pause", "finished", "closed"
            ]
        }
    },
    methods: {
        async row_click(id) {
            await this.$router.push({"name": "survey_datail", params: {id}})
        },
        async openNew(){
            const new_surwey = await $survey.post({})
            await this.row_click(new_surwey.id)
        },
        async deleteSelectedSurveys(id) {
            await $survey.delete(id)
            this.deleteSurveysDialog = false
            this.surveys = await $survey.list(this.surveys_params)
        },
        async open_survey_public(id) {
            let url = this.$router.resolve({name: 'survey_public', params: {id}}).href
            url = [location.origin, url].join("")
            await navigator.clipboard.writeText(url);
            const message = "Ссылка скопирование"
            store.dispatch("add_message", {message, type: 4})
            setTimeout(() => window.open(url, "_blank"), 3000)
            
        },
        async save_survey(){
            await $survey.patch(this.survey.id, this.survey)
            this.surveyDiolog = false
        }
    },
    async mounted() {
        this.surveys = await $survey.list(this.surveys_params)
        for (let survey of this.surveys) {
            survey.start_date = new Date(survey.start_date)
            if (survey.end_date) {
                survey.end_date = new Date(survey.end_date)
            }
        }
        console.log(this.surveys);
        store.commit("basic", {key: "loading", value: false})
    },
    computed: {
        loading: () => store.state.loading,
    }
}
</script>