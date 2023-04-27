<template>
<div>
    <div v-if="loading_map" class="layout-main row justify-content-center" style="width: 100%; height: 85vh">
        <div class="col">
            <ProgressSpinner style="top:40%; left:47%"/>
        </div>
    </div>
    <div v-if="!loading_map" style="width: 100%; height: 94vh; position: relative;">
        <div class="map-sidebar p-1" :class="sidebar_class">
            <div class="card rounded-4 p-3" style="height: 100%;">
                <div class="row align-items-center">
                    <div class="col-1 text-center">
                        <font-awesome-icon class="cursor-pointer" style="font-size: 1.4rem" icon="fa-solid fa-bars" @click="map_sidebar_open = !map_sidebar_open" />
                    </div>
                    <div v-if="map_sidebar_open && area_search_show" class="col-11 sidebar_item">
                        <Dropdown style="width: 100%" @change="select_search_area" @input="search_area" :editable="true" v-model="area_search" :options="area_table.features" 
                        :optionLabel="(area) => area.properties.translations[$i18n.locale].name" :placeholder="$t('Поиск по махаллям')"
                        :emptyFilterMessage="$t('Результатов не найдено')" :emptyMessage="$t('Результатов не найдено')" :emptySelectionMessage="$t('Результатов не найдено')"
                        />
                    </div>
                </div>
                
                <div class="row" v-for="row in sidebar_layers" :key="row" style="flex-direction: row!important;">
                    <div class="col-1 text-center">
                        <font-awesome-icon :icon="row.icon" />
                    </div>
                    <div v-if="map_sidebar_open" class="col sidebar_item">
                        <Checkbox :id="row.name" v-model="row.checked" :binary="true" @input="(v) => change_layer(v, row)"/>
                        <label @click="() => row.opened = !row.opened" :for="row.name" class="ml-3 cursor-pointer">{{$t(row.label)}}</label>
                        <div v-if="row.items && row.opened">
                            <div class="row" v-for="item in row.items" :key="item">
                                <div class="col-1 text-center">
                                    <font-awesome-icon :icon="item.icon" />
                                </div>
                                <div class="col">
                                    <Checkbox :id="item.name" v-model="item.checked" :binary="true" @input="async (v) => await change_layer(v, item, row)"/>
                                    <label :for="item.name" class="ml-3">{{$t(item.label)}}</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="base-layers">
            <div class="row">
                <div class="col p-1">
                    <img class="cursor-pointer" :src="dark_mode_icon" style="border-radius: 50%;" width="70" @click="set_dark_map"/>
                </div>
                <div class="col p-1">
                    <img class="cursor-pointer" :src="light_mode_icon" style="border-radius: 50%;" width="70" @click="set_light_map"/>
                </div>
            </div>
        </div>
        <div id="map" class="map" :class="map_class" style="z-index: 1"></div>
    </div>
</div>
</template>
<script>
import store from "@/store";
import L from "leaflet"
import {i18n} from '@/main'
import dark_mode_icon from "@/assets/images/map/dark_mode_icon.png"
import light_mode_icon from "@/assets/images/map/light_mode_icon.png"
import {toRaw} from 'vue'
import { Map } from "@/apps/map/models";
const get_lang = () => window.location.pathname.split('/')[1]
const map = new Map()

export default {
    name: "MapView",
    data() {
        return {
            layers: {},
            base_layer: store.state.darkMode ? 'dark' : 'light',
            map: null,
            dark_mode_icon, light_mode_icon,
            loading_map: false,
            map_sidebar_open: false,
            area_search_show: false,
            area_search: null,
            area_geojson: null,
            area_table: [],
            sidebar_layers: [
                {
                    name: 'ichd_group',
                    label: 'Индекс человеческого достоинства',
                    icon: 'fa-solid fa-users-gear',
                    checked: true,
                    opened: true,
                    items: [
                        {
                            name: 'ichd',
                            label: 'ИЧД по махаллям',
                            icon: 'fa-solid fa-user',
                            checked: true,
                        },
                        {
                            name: 'ichd_region',
                            label: 'ИЧД по регионам',
                            icon: 'fa-solid fa-users'
                        }
                    ]
                },
                {
                    name: 'education',
                    label: 'Образование',
                    icon: 'fa-solid fa-graduation-cap',
                    opened: false,
                    items: [
                        {
                            name: 'kindergarden',
                            label: 'Детский сад',
                            icon: 'fa-solid fa-child-reaching'
                        },
                        {
                            name: 'school',
                            label: 'Школа',
                            icon: 'fa-solid fa-school'
                        }
                    ]
                },
                {
                    name: 'medic',
                    label: 'Медицина',
                    icon: 'fa-solid fa-kit-medical',
                    opened: false,
                    items: [
                        {
                            name: 'apteka',
                            label: 'Аптеки',
                            icon: 'fa-solid fa-tablets'
                        },
                        {
                            name: 'polyclinic',
                            label: 'Поликлиники',
                            icon: 'fa-solid fa-hospital'
                        }
                    ]
                }, 
                {
                    name: 'shop',
                    label: 'Гипермаркеты, магазины',
                    icon: 'fa-solid fa-cart-shopping'
                },
                {
                    name: 'bus_stop',
                    label: 'Автобусные остановки',
                    icon: 'fa-solid fa-bus'
                }
            ]
        }
    }, 
    async mounted() {
        await this.init_map()
        await this.init_layers(this.sidebar_layers)
    },
    methods: { 
        async search_area(e) {
            this.area_table = await map.area_data.list({file: 0, search: this.area_search})
        },
        async select_search_area() {
            for (let layer of Object.values(this.area_geojson._layers)) {
                try{ 
                    layer._events.mouseout[0].fn({target: layer}) 
                    layer.closeTooltip()
                } catch {}
            }
            for (let layer of Object.values(this.area_geojson._layers)) {
                if (layer.feature.id === this.area_search.id) {
                    layer._events.click[0].fn({target: layer})
                    layer._events.mouseover[0].fn({target: layer})
                    layer.openTooltip()
                }
            }
        },
        async init_layers(layers) {
            this.layers.light = await this.get_map_light_layer()
            this.layers.dark = await this.get_map_dark_layer()
            this.layers[this.base_layer].addTo(toRaw(this.map))

            for (let value of layers) {
                const init_layer_func = this[`get_${value.name}_layer`]
                if (init_layer_func) {
                    this.layers[value.name] = await init_layer_func()
                    if (value.checked && this.layers[value.name]) {
                        this.layers[value.name].addTo(toRaw(this.map))
                    }
                }
                if (value.items) {
                    await this.init_layers(value.items)
                }
            }
        },
        async set_dark_map() {
            this.layers.light.remove()
            this.layers.dark.addTo(toRaw(this.map))
        },
        async set_light_map() {
            this.layers.dark.remove()
            this.layers.light.addTo(toRaw(this.map))
        },
        async change_layer(v, item, row) {
            if (!this.layers[item.name]) {
                if (item.items) {
                    for (let inlayer of item.items) {
                        inlayer.checked = v
                        await this.change_layer(v, inlayer)
                    }
                }
            } else {
                v ? this.layers[item.name].addTo(toRaw(this.map)) : this.layers[item.name].remove()
            }
            if (row) {
                row.checked = v ? true : row.items.reduce((a, v) => [...a, v.checked], []).includes(true) 
            }
        },
        async init_map() {
            this.map = L.map('map', {
                center: [41.3018622, 69.2684895],
                zoom: 12,
                minZoom: 10,
                zoomControl: false,
            })
            
            // Delete Leaflet link
            this.map.attributionControl.setPrefix('')
        },
        async get_map_dark_layer() {
        return L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
            maxZoom: 19,
        })
        },
        async get_map_light_layer() {
        return L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        })
        },
        async get_kindergarden_layer() {
            const icon = L.icon({
                iconUrl: '/maps/icons/kids.png',
                iconSize:     [20, 30], // size of the icon
                iconAnchor:   [20, 30], // point of the icon which will correspond to marker's location
                popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
            })

            const data = await map.kinder_garden.list()
            const markers = []
            for (let point of data.features) {
                let marker = L.marker([point.geometry.coordinates[1], point.geometry.coordinates[0]], {icon}).bindPopup(`<h4 class="text-center">${point.properties.translations[get_lang()].name}</h4>`)
                markers.push(marker)
            }
            return L.layerGroup(markers)
        },
        async get_polyclinic_layer() {
            const icon = L.icon({
                iconUrl: '/maps/icons/polyclinic.png',
                iconSize:     [25, 35], // size of the icon
                iconAnchor:   [25, 40], // point of the icon which will correspond to marker's location
                popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
            })

            const data = await map.polyclinic.list()
            const markers = []
            for (let point of data.features) {
                let marker = L.marker([point.geometry.coordinates[1], point.geometry.coordinates[0]], {icon}).bindPopup(`<h4 class="text-center">${point.properties.translations[get_lang()].name}</h4>`)
                markers.push(marker)
            }
            return L.layerGroup(markers)
        },
        async get_bus_stop_layer() {
            const icon = L.icon({
                iconUrl: '/maps/icons/bus_stop.png',
                iconSize:     [25, 35], // size of the icon
                iconAnchor:   [25, 40], // point of the icon which will correspond to marker's location
                popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
            })

            const data = await map.bus_stop.list()
            const markers = []
            for (let point of data.features) {
                let marker = L.marker([point.geometry.coordinates[1], point.geometry.coordinates[0]], {icon}).bindPopup(`<h4 class="text-center">${point.properties.translations[get_lang()] ? point.properties.translations[get_lang()].name : ''}</h4>`)
                markers.push(marker)
            }
            return L.layerGroup(markers)
        },
        async get_school_layer() {
            const icon = L.icon({
                iconUrl: '/maps/icons/school.png',
                iconSize:     [38, 60], // size of the icon
                iconAnchor:   [22, 60], // point of the icon which will correspond to marker's location
                popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
            })

            const data = await map.school.list()
            const markers = []
            for (let point of data.features) {
                let marker = L.marker([point.geometry.coordinates[1], point.geometry.coordinates[0]], {icon}).bindPopup(`<h4 class="text-center">${point.properties.translations[get_lang()].name}</h4>`)
                markers.push(marker)
            }
            return L.layerGroup(markers)
        },
        async get_shop_layer() {
            const icon = L.icon({
                iconUrl: '/maps/icons/shop.png',
                iconSize:     [35, 40], // size of the icon
                iconAnchor:   [35, 50], // point of the icon which will correspond to marker's location
                popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
            })

            const data = await map.shop.list()
            const markers = []
            for (let point of data.features) {
                let marker = L.marker([point.geometry.coordinates[1], point.geometry.coordinates[0]], {icon}).bindPopup(`<h4 class="text-center">${point.properties.translations[get_lang()].name}</h4>`)
                markers.push(marker)
            }
            return L.layerGroup(markers)
        },
        async get_apteka_layer(){
            const icon = L.icon({
                iconUrl: '/maps/icons/apteka.png',
                iconSize:     [20, 30], // size of the icon
                iconAnchor:   [20, 30], // point of the icon which will correspond to marker's location
                popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
            })

            const data = await map.apteka.list()
            const markers = []
            for (let point of data.features) {
                let marker = L.marker([point.geometry.coordinates[1], point.geometry.coordinates[0]], {icon}).bindPopup(`<h4 class="text-center">${point.properties.translations[get_lang()].name}</h4>`)
                markers.push(marker)
            }
            return L.layerGroup(markers)
        },  
        async get_ichd_layer() {
            const {t} = i18n.global
            // Fetch data
            await this.search_area()
            // Info panel
            const info = L.control({position: 'topright'});
            const info_div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
            info.onAdd = function (map) {
                this.update();
                return info_div;
            };
            info.update = async function (layer) {
                if (layer) {
                    let area = layer.feature.properties
                    if (area) {
                        area = await map.area_data.get(layer.feature.id)
                        let criteria_html = []
                        for (let c of area.criteria) {
                            criteria_html.push(`<p>${c.criteria.translations[get_lang()].name}: <b>${c.index}</b></p>`)
                        }
                        const places_list = {
                            'kindergarden': {
                                label: 'Детский сад',
                            },
                            'school': {
                                label: 'Школа',
                            }, 
                            'apteka': {
                                label: 'Аптеки',
                            },
                            'polyclinic': {
                                label: 'Поликлиники',
                            },
                            'shop': {
                                label: 'Гипермаркеты, магазины',
                            }
                        }

                        const places = []

                        for (let place of Object.keys(places_list)) {
                            places.push(`<p>${t(places_list[place].label)}: <b>${area[`${place}_count`]}</b></p>`)
                        }
                        
                        info_div.innerHTML = `
                            <p class="text-end area_close cursor-pointer" aria-hidden="true">X</p>
                            <p class="text-center" style="font-size: 1.5rem">${area.translations[get_lang()].name}</p>
                            <p>${t('Индекс человеческого достоинства')}: <b>${area.index}</b></p>
                            ${criteria_html.join('\n')}
                            <hr>
                            ${places.join('\n')}
                        `
                        info_div.querySelector('.area_close').onclick= () => {
                            info.update()
                        }

                    }
                } else {
                info_div.innerHTML = `
                    <p class="text-center">${t('Выберите махаллю')}</p>`
                }     
            };
            // Create layer
            const geojson = L.geoJSON(this.area_table, {
                style: function (feature) {
                    // set style
                    const all_colors = ["#EE391F", "#EE391F", "#EE391F", "#EE391F", "#EE391F", "#FAA10B", "#FAB807", "#F1E000", "#A4D12A", "#27B973"]
                    const area = feature.properties
                    if (area) {
                        return {
                            fillColor: all_colors[Math.round(area.index * 10) - 1],
                            weight: 2,
                            opacity: 1,
                            color: 'white',
                            dashArray: '3',
                            fillOpacity: 0.7,
                        };
                    }
                },
                onEachFeature: async function (feature, layer) {
                //events
                const area = feature.properties
                if (area) {            
                    layer.on({
                        mouseover: async function (e) {
                            var layer = e.target;
                            // Hover effect
                            layer.setStyle({
                                weight: 5,
                                color: '#666',
                                dashArray: '',
                                fillOpacity: 0.7
                            });
                            layer.bringToFront();
                            // ToolTip
                            layer.bindTooltip(`
                            <div>
                            <h4>${area.translations[get_lang()].name}</h4>
                            </div>`, {direction: 'top'});
                        },
                        mouseout: (e) => {
                            geojson.resetStyle(e.target);
                        },
                        click: (e) => {
                            var layer = e.target;
                            info.update(layer);
                        }
                    })
                }
                }
            }) 
            this.area_geojson = geojson
            geojson.onAdd = (map) => {
                geojson.eachLayer(map.addLayer, map);
                info.addTo(map)
                this.area_search_show = true
            }
            geojson.onRemove = (map) => {
                geojson.eachLayer(map.removeLayer, map);
                info.remove()
                this.area_search_show = false
            }
            return geojson
        },
        async get_ichd_region_layer() {
        const {t} = i18n.global
        // Fetch data
        const region_table = await map.region_data.list({file: 0})
        // Info panel
        const info = L.control({position: 'topright'});
        const info_div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        info.onAdd = function (map) {
            this.update();
            return info_div;
        };
        info.update = function (props) {
            if (props) {
                const region = props
                if (region) {
                    let criteria_html = []
                    for (let c of region.criteria) {
                        criteria_html.push(`<p>${c.criteria.translations[get_lang()].name}: <b>${c.index}</b></p>`)
                    }
                    info_div.innerHTML = `
                    <p class="text-center" style="font-size: 1.5rem">${region.translations[get_lang()].name}</p>
                    <p>${t('Индекс человеческого достоинства')}: <b>${region.index}</b></p>
                    ${criteria_html.join('\n')}
                    `
                }
            } else {
            info_div.innerHTML = `
                <p class="text-center">${t('Выберите регион')}</p>`
            }        
        };
        // Create layer
        const geojson = L.geoJSON(region_table, {
            style: function (feature) {
            // set style
            const all_colors = ["#EE391F", "#EE391F", "#EE391F", "#EE391F", "#EE391F", "#FAA10B", "#FAB807", "#F1E000", "#A4D12A", "#27B973"]
            const region = feature.properties
            if (region) {
                return {
                    fillColor: all_colors[Math.round(region.index * 10) - 1],
                    weight: 2,
                    opacity: 1,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: 0.7,
                };
            }
            },
            onEachFeature: async function (feature, layer) {
            //events
            const region = feature.properties
            if (region) {            
                layer.on({
                mouseover: (e) => {
                    var layer = e.target;
                    // Hover effect
                    layer.setStyle({
                        weight: 5,
                        color: '#666',
                        dashArray: '',
                        fillOpacity: 0.7
                    });
                    layer.bringToFront();
                    // ToolTip
                    layer.bindTooltip(`
                    <div>
                    <h4>${region.translations[get_lang()].name}</h4>
                    </div>`, {direction: 'top'});
                },
                mouseout: (e) => {
                    geojson.resetStyle(e.target);
                },
                click: (e) => {
                    var layer = e.target;
                    info.update(layer.feature.properties);
                }
                })
            }
            }
        }) 
        geojson.onAdd = (map) => {
            geojson.eachLayer(map.addLayer, map);
            info.addTo(map)
        }
        geojson.onRemove = (map) => {
            geojson.eachLayer(map.removeLayer, map);
            info.remove()
        }
        return geojson
        },
    },
    watch: {
        async darkMode (n) {
            if (!n) {
                await this.set_light_map()
            } else {
                await this.set_dark_map()
            }
        }
    },
    computed: {
        sidebar_class() {
            return {
                'map-sidebar-open': this.map_sidebar_open,
                'map-sidebar-closed': !this.map_sidebar_open
            }
        },
        map_class() {
            return {'map_close': this.map_sidebar_open}
        },
        computed_map () {
            return this.map
        },
        darkMode: () => store.state.darkMode,
    }
}
</script>

<style>
.info {
    padding: 6px 8px;
    font: 14px/16px Arial, Helvetica, sans-serif;
    background: var(--surface-card);
    box-shadow: 0 0 15px rgba(0,0,0,0.2);
    border-radius: 0.5rem;
    max-width: 80vw;
}
.info h4 {
    margin: 0 0 5px;
    color: #777;
}
path.leaflet-interactive:focus {
    outline: none !important;
}
.leaflet-control-layers-toggle {
    background-color: var(--surface-ground)!important;
}
.leaflet-control-layers-list {
    background-color: var(--surface-ground)!important;
}
.leaflet-control-layers-expanded {
    background-color: var(--surface-ground)!important;
    padding: 1rem !important;
    margin: 0 !important;
    border: 0;
    border-radius: 0.5rem;
}
.map-sidebar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    z-index: 2;
    transition: 0.5s;
    overflow: hidden;
}
.area-search {
    position: absolute;
    top: 20px;
    left: 27.5%;
    width: 45%;;
    z-index: 2;
    padding: 0;
}
.map-sidebar-open {
    width: 400px;
}
.map-sidebar-closed {
    width: 55px;
}
.map {
    width: 100%; 
    height: 100%; 
    right: 0; 
    position: fixed;
}
.base-layers {
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 2;
    padding: 2rem;
}
.sidebar_item {
    animation-duration: 0.5s;
    animation-name: sidebar_text;
}
@keyframes sidebar_text {
    0% {
        display: none;
        opacity: 0;
    }
    90% {
        display: block;
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}
</style>