<template>
    <VueApexCharts type="bar" :options="chartOptions" :series="series"/>
</template>
<script>
import VueApexCharts from "vue3-apexcharts";

export default {
    name: 'Bar',
    props: ['series', 'labels'],
    components: {VueApexCharts},
    data() {
        const all_colors = ["#EE391F", "#EE391F", "#EE391F", "#EE391F", "#EE391F", "#FAA10B", "#FAB807", "#F1E000", "#A4D12A", "#27B973"]
        const colors = []
        const xaxis_colors = []

        for (let dataset of this.series) {
            for (let v of dataset.data) {
                v = Math.round(v * 10)
                if (v > 10) {
                    colors.push(all_colors[all_colors.length - 1])
                } else if (v <= 0) {
                    colors.push(all_colors[0])
                } else {
                    colors.push(all_colors[v - 1])
                }
                xaxis_colors.push('var(--surface-900)')
            }
        }

        const translate_labels = []
        for (let label of this.labels) {
            translate_labels.push(this.$t(label))
        }

        return {
            chartOptions: {
                responsive: [{
                    breakpoint: 1000,
                    options: {
                        chart: {
                            width: '100%',
                            height: '500px',
                        },
                        plotOptions: {
                            bar: {
                                horizontal: false
                            }
                        },
                        yaxis: {
                            show: false,
                            labels: {
                                show: false,
                            }
                        },
                        xaxis: {
                            labels: {
                                rotate: -90,
                            }
                        }
                    },
                }],
                chart: {
                    toolbar: {
                        show: false
                    },
                    height: 150,
                    type: 'bar',
                },
                tooltip: {
                    x: {
                        show: false
                    },
                    thema: true
                },
                colors: colors,
                plotOptions: {
                    bar: {
                        columnWidth: '65%',
                        distributed: true,
                        borderRadius: 10,
                        dataLabels: {
                            position: 'top', // top, center, bottom
                        },
                    }
                },
                dataLabels: {
                    enabled: true,
                    offsetY: -20,
                    formatter: function (val, opts) {
                        let val_array = `${val}`.split('.')
                        if (val_array[1]) {
                            val_array[1] = `${val_array[1]}000`
                        } else {
                            val_array[1] = '000'
                        }
                        return val_array.join('.').slice(0, 5);
                    },
                    style: {
                        fontSize: '14px',
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        fontWeight: 'bold',
                        colors: ["var(--surface-900)"]
                    },
                },
                legend: {
                    show: false
                },
            xaxis: {
                categories: translate_labels,
                labels: {
                    style: {
                        fontSize: '14px',
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        fontWeight: 'bold',
                        colors: xaxis_colors,
                    }
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
                formatter(v) {return Math.round(v * 1000) / 1000},
              },
              max: 1,
              forceNiceScale: true,
              tickAmount: 5,
            },
          },
        }
    }

}
</script>

<style>
.apexcharts-tooltip {
    background: var(--surface-card)!important;
    color: var(--surface-card)!important;
    border-color: var(--surface-card)!important;
  }
</style>