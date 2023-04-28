<template>
    <div style="max-width: 1504px; margin-left: auto; margin-right: auto;">
        <h2 class="text-center mt-3">{{ survey.name }}</h2>
        <div class="card m-3">
            <h3 class="text-center">{{ $t("Таблица резултатов") }}</h3>
            <div id="surveyDashboardContainer"></div>
        </div>
        <div class="card m-3">
            <h3 class="text-center">{{ $t("Дашбоард") }}</h3>
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
import { Model } from 'survey-core';
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
        return {
            results: [],
            survey_json: {},
            survey: {}
        }
    },
    async mounted() {
        localization.currentLocale = this.$i18n.locale
        const $survey_result = new SurveyResult({survey_id: this.id})
        const results = await $survey_result.list()
        this.results = results.map((v) => v.data)
        this.survey = await $survey.get(this.id)
        this.survey_json = this.survey.data
        const survey = new Model(this.survey_json);
        const visPanelTabuler = new SurveyAnalyticsTabulator.Tabulator(
            survey, this.results, {}
        );
        visPanelTabuler.render("surveyDashboardContainer");

        const vizPanel = new VisualizationPanel(
            survey.getAllQuestions(),
            this.results,
            vizPanelOptions
        );
        vizPanel.showHeader = true;
        vizPanel.onStateChanged.add(function() {
            window.localStorage.setItem("saPanelState", JSON.stringify(vizPanel.state));
        });
        vizPanel.render("surveyVizPanel");
    }
}
</script>
<style>
.sa-commercial, .sa-panel__header {
    display: none;
}
</style>