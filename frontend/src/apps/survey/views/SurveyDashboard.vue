<template>
    <div v-if="loading" class="layout-main row justify-content-center">
        <div class="col">
            <ProgressSpinner style="top:30%; left:47%"/>
        </div>
    </div>
    <div v-if="!loading" class="card" style="max-width: 1504px; margin-left: auto; margin-right: auto;">
        <h2 class="text-center mt-3">{{ survey.name }}</h2>
        <Toolbar class="mb-4">
            <template #start>
                <span class="p-input-icon-left">
                    <i class="pi pi-search" />
                    <Calendar v-model="dates" selectionMode="range" 
                    :manualInput="false" showTime hourFormat="24" dateFormat="dd.mm.yy"
                    @update:modelValue="change_dates"
                    />
                </span>
            </template>
        </Toolbar>

        <h3 class="text-center">{{ $t("Таблица резултатов") }}</h3>
        <div id="surveyDashboardContainer"></div>
        <h3 class="text-center mt-2">{{ $t("Дашбоард") }}</h3>
        <div id="surveyVizPanel" />
    </div>
</template>
<script>
import "tabulator-tables/dist/css/tabulator.min.css";
import "survey-analytics/survey.analytics.tabulator.css";
import 'survey-analytics/survey.analytics.min.css';
import {SurveyResult, Survey} from "../models"
import * as XLSX from "xlsx";
import { Model } from 'survey-core';
import { VisualizationPanel, localization } from 'survey-analytics';
import * as SurveyAnalyticsTabulator from "survey-analytics/survey.analytics.tabulator";
import store from "@/store";
const $survey = new Survey()
const vizPanelOptions = {
  allowHideQuestions: true,
}

window.XLSX = XLSX;

export default {
    name: 'SurveyDashboard',
    props: ["id"],
    data() {
        let now = new Date()
        const dates = [new Date(now.getFullYear(), now.getMonth(), now.getDay(), 0, 0, 0), new Date(now.getFullYear(), now.getMonth(), now.getDay(), 23, 59, 59)]
        return {
            loading: true,
            results: [],
            survey_json: {},
            survey: {},
            dates,
            results_params: {...this.dates_to_iso_dict(dates)}
        }
    },
    async mounted() {
        localization.currentLocale = this.$i18n.locale
        const $survey_result = new SurveyResult({survey_id: this.id})
        const results = await $survey_result.list(this.results_params)
        this.survey = await $survey.get(this.id)
        this.loading = false
        setTimeout(async () => await this.render(results))
    },
    methods: {
        async change_dates(e) {
            if (e[1]) {
                const $survey_result = new SurveyResult({survey_id: this.id})
                this.results_params = {...this.results_params, ...this.dates_to_iso_dict(e)}
                const results = await $survey_result.list(this.results_params)
                this.loading = false
                setTimeout(async () => await this.render(results))
            }
        },
        async render(results) {
            results = results.map((v) => v.data)
            this.survey_json = this.survey.data
            const survey = new Model(this.survey_json);
            const visPanelTabuler = new SurveyAnalyticsTabulator.Tabulator(
                survey, results, {}
            );
            visPanelTabuler.render("surveyDashboardContainer");
            document.getElementById("surveyVizPanel").innerHTML = ""
            const vizPanel = new VisualizationPanel(
                survey.getAllQuestions(),
                results,
                vizPanelOptions
            );
            vizPanel.showHeader = true;
            vizPanel.render("surveyVizPanel");
        },
        dates_to_iso_dict(dates) {
            return {
                date__gte: dates[0].toISOString().slice(0, 19), date__lte: dates[1].toISOString().slice(0, 19)
            }
        }
    },
}
</script>
<style>
.sa-commercial, .sa-panel__header {
    display: none;
}
</style>