<template>
<div class="col-12 row p-0 justify-content-between">
    <div class="card col-5 col-lg mb-2 rounded-4 ml-3 mr-3" v-for="(item, i) in items" :key="item">
        <router-link :to="{name: url_params.name, query: {...url_params.query, ...$route.query, criteria: item.id}}">
        <div style="text-align: center;">
            <div class="row justify-content-center mb-1">
                <div class="flex align-items-center justify-content-center border-round mb-1" style="width:3rem;height:3rem">
                    <font-awesome-icon :icon="icons[i]" style="font-size: 3rem;" :class="icon_bg_color_classes[i]"/>
                </div>
            </div>
            <div class="col p-0 text-900 font-medium text-xl">{{item.index}}</div>
            <p class="text-center text-500 font-medium">{{ item.translations[$i18n.locale].name}}</p>
        </div>
        </router-link>
    </div>
    <div></div>
    </div>
</template>
<script>
export default {
    name: "CategoryIndex",
    props: ['items', "url_params"],
    data() {
        return {
            icon_bg_color_classes: ['text-blue-300', 'text-green-300', 'text-orange-300', 'text-red-300', 'text-purple-300', 'text-blue-300', 'text-yellow-300', 'text-green-300'],
            icons: ['fa-solid fa-hands-holding-child', 'fa-solid fa-kit-medical', 'fa-solid fa-graduation-cap', 'fa-solid fa-shield-halved', 'fa-solid fa-briefcase',
        'fa-solid fa-wallet',  'fa-solid fa-building-wheat', 'fa-solid fa-chart-line']
        }
    }
}
</script>