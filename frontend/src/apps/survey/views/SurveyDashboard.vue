<template>
    
    <div class="card" style="max-width: 1504px; margin-left: auto; margin-right: auto;">
        <h2 class="text-center mt-3">{{ survey.name }}</h2>
        <Dialog v-model:visible="surveyTable" :style="{width: '80%', height: '80%'}" header="Confirm" :modal="true">
            <template #header>
                <h4 class="m-2">{{ $t('Таблица резултатов') }}</h4>
            </template>
            <div id="surveyDashboardContainer"></div>
        </Dialog>
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

        <div v-if="loading" class="layout-main row justify-content-center">
        <div class="col">
            <ProgressSpinner style="top:30%; left:47%"/>
        </div>
    </div>
    <div v-if="!loading">       
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
        let now = new Date()
        const dates = [new Date(now.getFullYear(), now.getMonth(), now.getDay(), 0, 0, 0), new Date(now.getFullYear(), now.getMonth(), now.getDay(), 23, 59, 59)]
        return {
            loading: true,
            results: [],
            survey_json: {},
            survey: {},
            dates,
            results_params: {...this.dates_to_iso_dict(dates)},
            include_questions: {},
            surveyTable: false
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
        async show_table_results() {
            this.surveyTable = true
            setTimeout(() => {
                this.survey_json = this.survey.data
                const survey = new Model(this.survey_json);
                const visPanelTabuler = new SurveyAnalyticsTabulator.Tabulator(
                    survey, this.results, {}
                );
                visPanelTabuler.render("surveyDashboardContainer");
            }, 1000)
        },  
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
        async refactor_survey(survey) {
            const new_survey = JSON.parse(JSON.stringify(survey))
            new_survey.data.pages = []
            for (let page of survey.data.pages) {
                let new_page = JSON.parse(JSON.stringify(page))
                let questions = {}
                for (let element of page.elements) {
                    if (element.type === "dropdown") {
                        if (questions[element.title.default]) {
                            questions[element.title.default].choices = [...questions[element.title.default].choices, ...element.choices]
                            questions[element.title.default].choices.sort()
                            this.include_questions[questions[element.title.default].name].push(element.name)
                        } else {
                            questions[element.title.default] = element
                            this.include_questions[element.name] = [element.name]
                        }
                    } else {
                        questions[element.title.default] = element
                    }
                }
                new_page.elements = Object.values(questions)
                new_survey.data.pages.push(new_page)
            }
            return new_survey
        },
        async refactor_result_survay(results) {
            const new_result = []
            for (let result of results) {
                const user_result = {}
                for (let q in result) {
                    for (let iq in this.include_questions) {
                        if (this.include_questions[iq].includes(q)) {
                            user_result[iq] = result[q]
                        } else {
                            user_result[q] = result[q]
                        }
                    }
                }
                new_result.push(user_result)
            }
            return new_result
        },
        async render(results) {
            results = results.map((v) => {v.data.date = v.date; return v.data})
            this.results = results
            this.survey_json = this.survey.data
            const survey = new Model(this.survey_json);
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