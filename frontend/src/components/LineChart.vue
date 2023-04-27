<template>
<div class="row justify-content-center">
    <div class="col-lg-6 col-12" v-for="chart in charts" :key="chart">
        <h4 class="text-center">{{ chart.data.name }}</h4>
        <apexchart type="line" height="300" :options="chart.options" :series="chart.series"></apexchart>
    </div>
</div>
</template>
<script>
import VueApexCharts from 'vue3-apexcharts';
export default {
    name: 'LineChart',
    props: ['labels', 'dataset'],
    components: {apexchart: VueApexCharts},
    data() {
        const x_color = []
        for (let l of this.labels) {
            x_color.push('var(--surface-900)')
        }
        const charts = []
        for (let d of this.dataset) {
            charts.push({
                data: d,
                series: [{
                    name: d.name,
                    data: d.data.reduce((a, v) => [...a, Math.round(v * 1000) / 1000], [])
                }],
                options: {
                    chart: {
                        toolbar: {
                            tools: {
                                download: false,
                                selection: true,
                                zoom: true,
                                zoomin: true,
                                zoomout: true,
                                pan: true,
                                reset: true | '<img src="/static/icons/reset.png" width="20">',
                                customIcons: []
                            },
                        },
                        id: d.label,
                        group: 'social',
                        type: 'line',
                    },
                    tooltip: {
                        x: {
                            show: false
                        },
                        thema: true
                    },
                    fill: {
                        type: 'gradient',
                        gradient: {
                            shade: 'dark',
                            gradientToColors: ['#EE391F'],
                            shadeIntensity: 1,
                            type: 'horizontal',
                            opacityFrom: 1,
                            opacityTo: 1,
                            stops: [0, 100, 100, 100]
                        },
                    },
                    dataLabels: {
                        style: {
                            fontSize: '14px',
                            fontFamily: 'Helvetica, Arial, sans-serif',
                            fontWeight: 'bold',
                            colors: ["var(--surface-900)"]
                        },
                    },
                    legend: {
                        show: true
                    },
                    xaxis: {
                        axisBorder: {
                            show: true
                        },
                        axisTicks: {
                            show: true,
                        },
                        categories: this.labels,
                        labels: {
                            style: {
                                fontSize: '14px',
                                fontFamily: 'Helvetica, Arial, sans-serif',
                                fontWeight: 'bold',
                                colors: x_color,
                            }
                        }
                    },
                    markers: {
                        size: 5,
                        hover: {
                            sizeOffset: 1.5
                        }
                    },
                    yaxis: {
                        axisBorder: {
                            show: true
                        },
                        axisTicks: {
                            show: true,
                        },
                        labels: {
                            show: true,
                            style: {
                                    fontSize: '14px',
                                    fontFamily: 'Helvetica, Arial, sans-serif',
                                    fontWeight: 'bold',
                                    colors: ["var(--surface-900)"],
                                },
                        },
                        max: 1,
                        min: 0
                    },
                    grid: {
                        show: false,
                    }
                }
            })
        }
        return {
            charts
        }
    },  
}
</script>
<style>
.apexcharts-tooltip, .apexcharts-xaxistooltip {
    background: var(--surface-card)!important;
    color: var(--surface-card)!important;
    border-color: var(--surface-card)!important;
  }
.col-first-12:first-child {
    width: 100% !important;
}
</style>