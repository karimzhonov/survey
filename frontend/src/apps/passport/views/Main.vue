<template>
    <div v-if="loading" class="layout-main row justify-content-center">
        <div class="col">
            <ProgressSpinner style="top:30%; left:47%"/>
        </div>
    </div>
    <div v-if="!loading">
        <div class="row" style="width: 100%;">
            <div class="col-12 col-lg-3" v-for="region in regions" :key="region.id">
                <RouterLink :to="{name: 'passport_region_data', query: $route.query, params: {region_id: region.id}}">
                    <div class="card rounded-4">
                        <img :src="region.image" :alt="region.name"/>
                        <h4 class="text-center mt-5">{{ region.translations[$i18n.locale].name }}</h4>
                    </div>
                </RouterLink>
            </div>
        </div>
    </div>
</template>
<script>
import store from '@/store';
import { Region } from '@/apps/geodata/models';

export default {
    name: 'Layout',
    data() {return {regions: []}},
    async mounted() {
        const region = new Region()
        this.regions = await region.list()
        store.commit('basic', {key: 'loading', value: false})
    },
    computed: {
        loading: () => store.state.loading,
    }
}
</script>