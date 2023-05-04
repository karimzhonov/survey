<template>
    
    <div class="card" style="max-width: 1504px; margin-left: auto; margin-right: auto;">
        <h2 class="text-center mt-3">{{ survey.name }}</h2>
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
        </Toolbar>

        <div v-if="loading" class="layout-main row justify-content-center">
        <div class="col">
            <ProgressSpinner style="top:30%; left:47%"/>
        </div>
    </div>
    <div v-if="!loading">
        <h3 class="text-center">{{ $t("Таблица резултатов") }}</h3>
        <div id="surveyDashboardContainer"></div>
        <h3 class="text-center mt-2">{{ $t("Дашбоард") }}</h3>
        <div id="surveyVizPanel" />
    </div>
    </div>
</template>
<script>
import "tabulator-tables/dist/css/tabulator.min.css";
import "survey-analytics/survey.analytics.tabulator.css";
import 'survey-analytics/survey.analytics.min.css';
import {SurveyResult, Survey} from "../models"
import * as XLSX from "xlsx";
import { Model, QuestionTextModel } from 'survey-core';
import { VisualizationPanel, localization } from 'survey-analytics';
import * as SurveyAnalyticsTabulator from "survey-analytics/survey.analytics.tabulator";

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
        async change_dates() {
            if (this.dates[1]) {
                this.loading = true
                const $survey_result = new SurveyResult({survey_id: this.id})
                this.results_params = {...this.results_params, ...this.dates_to_iso_dict(this.dates)}
                const results = await $survey_result.list(this.results_params)
                this.loading = false
                setTimeout(async () => await this.render(results))
            }
        },
        async render(results) {
            results = results.map((v) => {v.data.date = v.date; return v.data})
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
            const new_dates = [
                new Date(dates[0].getFullYear(), dates[0].getMonth(), dates[0].getDay(), dates[0].getHours() + 5, dates[0].getMinutes(), 0), 
                new Date(dates[1].getFullYear(), dates[1].getMonth(), dates[1].getDay(), dates[1].getHours() + 5, dates[1].getMinutes(), 0)
            ]
            return {
                date__gte: new_dates[0].toISOString({timezone: "UTC"}).slice(0, 19), date__lte: new_dates[1].toISOString().slice(0, 19)
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