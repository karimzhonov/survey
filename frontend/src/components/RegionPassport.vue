<template>
    <div v-if="loading" class="layout-main row justify-content-center">
        <div class="col">
            <ProgressSpinner style="top:30%; left:47%"/>
        </div>
    </div>
    <div v-if="!loading" class="card rounded-4" :style="styles.card">
        <h1 class="text-center font-weight-bold" :style="styles.h1">{{ region.translations ? region.translations[$i18n.locale].name : '' }}</h1>
        <h2 class="text-center font-weight-bold text-decoration-underline" :style="styles.h2">I. {{ $t('Ключевые показатели') }}</h2>
        <div class="row">
            <div class="col-lg-6 col-12" :style="styles.col_6">
                <img style="width: 100%" :src="region.image" alt="region_img">
            </div>
            <div class="col-lg-6 col-12" :style="styles.col_6">
                <p :style="styles.p">{{search_label(data, 2)}} - <strong>{{ search_value(data, 2) }}</strong></p>
                <p :style="styles.p">{{search_label(data, 3)}} - <strong>{{ search_value(data, 3) }} {{$t('кв.км')}} ({{search_value(data, 4) }} {{ $t('га') }})</strong></p>
                <p :style="styles.p">{{$t('Из этого')}}: <strong>{{ search_value(data, 76) }}</strong></p>
                <p :style="styles.p">{{search_label(data, 5)}} - <strong>{{ search_value(data, 5) }} {{ $t('тысяч') }} {{ $t('ед.') }}</strong></p>
                <p :style="styles.p">{{search_label(data, 6)}} - <strong>{{ search_value(data, 6) }} {{ $t('ед.') }}</strong></p>
                <p :style="styles.p">{{search_label(data, 7)}} - <strong>{{ search_value(data, 7) }} {{ $t('ед.') }}</strong></p>
                <p :style="styles.p">{{$t('Национальный состав')}}: 
                    {{search_label(data, 9)}} (<strong>{{ search_value(data, 9) }} %)</strong>, <br>
                    {{search_label(data, 13)}} (<strong>{{ search_value(data, 13) }} %)</strong>,
                    {{search_label(data, 12)}} (<strong>{{ search_value(data,12) }} %)</strong>,  <br>
                    {{search_label(data, 15)}} (<strong>{{ search_value(data, 15) }} %)</strong>,
                    {{search_label(data, 14)}} (<strong>{{ search_value(data, 14) }} %)</strong>, <br>
                    {{search_label(data, 11)}} (<strong>{{ search_value(data, 11) }} %)</strong>,
                    {{search_label(data, 10)}} (<strong>{{ search_value(data, 10) }} %)</strong>, <br>
                    {{search_label(data, 16)}} (<strong>{{ search_value(data, 16) }} %)</strong>.
                </p>
                <p :style="styles.p">{{ search_value(data, 8) }}</p>
            </div>
        </div>
        <Divider v-if="styles.divider"/>
        <h2 class="text-center font-weight-bold text-decoration-underline" :style="styles.h2">II. {{ $t('Макроэкономические показатели') }}</h2>
        <div class="row">
            <div class="col-lg-6 col-12" :style="styles.col_6">
                <p :style="styles.p">{{search_label(data, 17)}} - <strong>{{ search_value(data, 17) }}  {{ $t('млрд сум') }} ({{ search_value(data, 18) }}%) </strong></p>
                <p :style="styles.p">{{search_label(data, 19)}} - <strong>{{ search_value(data, 19) }}  {{ $t('млрд сум') }} ({{ search_value(data, 20) }}%) </strong></p>
            </div>
            <div class="col-lg-6 col-12" :style="styles.col_6">
                <p :style="styles.p">{{search_label(data, 21)}} - <strong>{{ search_value(data, 21) }}  {{ $t('млрд сум') }} ({{ search_value(data, 22) }}%) </strong></p>
                <p :style="styles.p">{{search_label(data, 23)}} - <strong>{{ search_value(data, 23) }}  {{ $t('млрд сум') }} ({{ search_value(data, 24) }}%) </strong></p>
                <p :style="styles.p">{{search_label(data, 25)}} - <strong>{{ search_value(data, 25) }} {{ $t('млрд сум') }} ({{ search_value(data, 26) }}%) </strong></p>
            </div>
        </div>
        <Divider v-if="styles.divider"/>
        <h2 class="text-center font-weight-bold text-decoration-underline" :style="styles.h2">III. {{ $t('Социально-экономические показатели') }}</h2>
        <div class="row">
            <div class="col-lg-6 col-12" :style="styles.col_6">
                <p :style="styles.p">{{search_label(data, 27)}} - <strong>{{ parseInt(search_value(data, 27)) }} {{ $t('ед.') }} ({{ parseInt(search_value(data, 28)) }} {{ $t('ед.') }} {{ $t('частный') }}) </strong></p>
                <p :style="styles.p">{{search_label(data, 29)}} - <strong>{{ parseInt(search_value(data, 29)) }} {{ $t('ед.') }} ({{ parseInt(search_value(data, 30)) }} {{ $t('ед.') }} {{ $t('частный') }}) </strong></p>
                <p :style="styles.p">{{search_label(data, 31)}} - <strong>{{ parseInt(search_value(data, 31)) }} {{ $t('ед.') }}</strong></p>
                <p :style="styles.p">{{search_label(data, 32)}} - <strong>{{ parseInt(search_value(data, 32)) }} {{ $t('ед.') }} ({{ parseInt(search_value(data, 33)) }} {{ $t('ед.') }} {{ $t('частный') }}) </strong></p>
                <p :style="styles.p">{{search_label(data, 34)}} - <strong>{{ parseInt(search_value(data, 34)) }} {{ $t('ед.') }}</strong></p>
            </div>
            <div class="col-lg-6 col-12" :style="styles.col_6">
                <p :style="styles.p">{{search_label(data, 37)}} - <strong>{{ parseInt(search_value(data, 37)) }} {{ $t('ед.') }}</strong></p>
                <p :style="styles.p">{{search_label(data, 38)}} - <strong>{{ search_value(data, 38) }} %</strong></p>
                <p :style="styles.p">{{search_label(data, 39)}} - <strong>{{ parseInt(search_value(data, 39)) }} {{ $t('чел.') }}</strong></p>
                <p :style="styles.p">{{search_label(data, 40)}} - <strong>{{ search_value(data, 40) }} {{ $t('чел.') }}</strong></p>
            </div>
        </div>
        <Divider v-if="styles.divider"/>
        <div class="row">
            <div class="col-lg-6 col-12" :style="styles.col_6">
                <p :style="styles.p">{{search_label(data, 41)}} - <strong>{{ parseInt( search_value(data, 41)) }} {{ $t('ед.') }}</strong> <br/>
                    ({{ $t('passport.detail.locale_1', {year: parseInt(year.year) - 1}) }} <strong> {{ parseInt(search_value(data, 42)) }} 
                    {{ parseInt(search_value(data, 42)) > 0 ? $t('ед. больше') : parseInt(search_value(data, 42)) > 0 ? $t('ед. меньше') : $t('не изменилься')}}</strong>)</p>
            </div>
            <div class="col-lg-6 col-12">
                <p :style="styles.p">{{search_label(data, 35)}} - <strong>{{ search_value(data, 35) }}  {{ $t('млрд сум') }} ({{ search_value(data, 36) }}%) </strong></p>
            </div>
        </div>
        <Divider v-if="styles.divider"/>
        <div class="row">
            <div class="col-lg-6 col-12" :style="styles.col_6">
                <p :style="styles.p">{{search_label(data, 43)}} - <strong>{{ search_value(data, 43) }}% </strong></p>
            </div>
            <div class="col-lg-6 col-12">
                <p :style="styles.p">{{search_label(data, 44)}} - <strong>{{ search_value(data, 44)  }}% </strong></p>
                <p :style="styles.p">{{search_label(data, 45)}} - <strong>{{ search_value(data, 45)  }}% </strong></p>
            </div>
        </div>
        <Divider v-if="styles.divider"/>
        <div class="row">
            <div class="col-lg-6 col-12" :style="styles.col_6">
                <p :style="styles.p">{{search_label(data, 46)}} - <strong>{{ search_value(data, 46) }} {{ $t('ед.') }}</strong></p>
            </div>
            <div class="col-lg-6 col-12">
                <p :style="styles.p">{{search_label(data, 47)}} - <strong>{{ parseInt(search_value(data, 47)) }}  {{ $t('ед.') }}</strong></p>
                <p :style="styles.p">{{search_label(data, 23)}} - <strong>{{ parseInt(search_value(data, 23)) }}  {{ $t('ед.') }}</strong></p>
                <p :style="styles.p">{{search_label(data, 48)}} - <strong>{{ parseInt(search_value(data, 48)) }} {{ $t('ед.') }}</strong></p>
            </div>
        </div>
        <Divider v-if="styles.divider"/>
        <div class="row">
            <div class="col-lg-6 col-12" :style="styles.col_6">
                <p :style="styles.p">{{search_label(data, 50)}} - <strong>{{ search_value(data, 50) }} {{ $t('млрд сум') }}, {{ parseFloat(search_value(data, 51)) > 0 ? `${$t('рост')} (${search_value(data, 51)}%)` : parseFloat(search_value(data, 51)) < 0 ? `${$t('отклонения')} (${search_value(data, 51)}%)`  : ''}}</strong></p>
            </div>
            <div class="col-lg-6 col-12">
                <p :style="styles.p">{{search_label(data, 52)}} - <strong>{{ search_value(data, 52) }}% ({{ search_value(data, 53) }} {{ $t('млрд сум') }}, {{ $t('темп роста') }} {{ search_value(data, 54) }}%)</strong></p>
            </div>
        </div>
        <Divider v-if="styles.divider"/>
        <div class="row">
            <div class="col-lg-6 col-12" :style="styles.col_6">
                <p :style="styles.p">{{search_label(data, 55)}} - <strong>{{ search_value(data, 55) }} {{ $t('млрд сум') }}</strong></p>
            </div>
            <div class="col-lg-6 col-12" :style="styles.col_6">
                <p :style="styles.p">{{search_label(data, 56)}} - <strong>{{ search_value(data, 56) }} {{ $t('млрд сум') }}</strong></p>
            </div>
        </div>
        <Divider v-if="styles.divider"/>
        <div class="row">
            <div class="col-lg-6 col-12" :style="styles.col_6">
                <p :style="styles.p">{{$t('passport.detail.locale_2', {period: to_back_kvartal[kvartal]})}} - <strong>{{ search_value(data, 57) }} {{ $t('тысяч') }} {{ $t('доллар') }}, <br/> {{$t('на практике')}} - {{ search_value(data, 58) }} {{ $t('тысяч') }} {{ $t('доллар') }} ({{ search_value(data, 59) }}%)</strong></p>
            </div>
            <div class="col-lg-6 col-12" :style="styles.col_6">
                <p :style="styles.p">{{year.year}} {{search_label(data, 48)}} - <strong>{{ search_value(data, 60) }} {{ $t('тысяч') }} {{ $t('доллар') }}, {{$t('на практике')}} - {{ search_value(data, 61) }} {{ $t('тысяч') }} {{ $t('доллар') }} ({{ search_value(data, 62) }}%)</strong></p>
                <p :style="styles.p">{{search_label(data, 63)}} - <strong>{{ search_value(data, 63) }} {{ $t('тысяч') }} {{ $t('доллар') }}, {{$t('на практике')}} - {{ search_value(data, 64) }} {{ $t('тысяч') }} {{ $t('доллар') }} ({{ search_value(data, 65) }}%)</strong></p>
            </div>
        </div>
        <Divider v-if="styles.divider"/>
        <div class="row">
            <div class="col-lg-6 col-12" :style="styles.col_6">
                <p :style="styles.p">{{search_label(data, 66)}} - <strong>{{ search_value(data, 66) }} {{ $t('млрд сум') }}</strong></p>
            </div>
            <div class="col-lg-6 col-12">
                <p :style="styles.p">{{search_label(data, 67)}} - <strong>{{ search_value(data, 67) }} {{ $t('млрд сум') }} ({{ search_value(data, 68) }} {{ $t('ед.') }})</strong></p>
            </div>
        </div>
        <Divider v-if="styles.divider"/>
        <div class="row">
            <div class="col-lg-4 col-12" :style="styles.col_6">
                <p :style="styles.p">{{search_label(data, 69)}} - <strong>{{ search_value(data, 69).split('.')[0] }} {{ $t('ед.') }} {{ $t('семей') }}</strong>, {{ $t('выпущенный') }} - <strong>{{ search_value(data, 70).split('.')[0] }} {{ $t('ед.') }}</strong>, {{ $t('осталось') }} - <strong>{{ search_value(data, 71).split('.')[0] }} {{ $t('ед.') }}</strong></p>
            </div>
            <div class="col-lg-4 col-12">
                <p :style="styles.p">{{search_label(data, 72)}} - <strong>{{ search_value(data, 72).split('.')[0] }} {{ $t('ед.') }}</strong></p>
            </div>
            <div class="col-lg-4 col-12" :style="styles.col_6">
                <p :style="styles.p">{{search_label(data, 73)}} - <strong>{{ search_value(data, 73).split('.')[0] }} {{ $t('ед.') }}</strong>, {{ $t('выпущенный') }} - <strong>{{ search_value(data, 74).split('.')[0] }} {{ $t('ед.') }}</strong>, {{ $t('осталось') }} - <strong>{{ search_value(data, 75).split('.')[0] }} {{ $t('ед.') }}</strong></p>
            </div>
        </div>
    </div>
</template>

<script>
import store from '@/store';
import { RegionPassport } from '@/apps/passport/models';

export default {
    name: 'AreaPassport',
    props: ['region_id', 'styles', 'file'],
    data() {
        return {
            data: [],
            to_back_kvartal: {
                'январь-март': 'январь-декабрь',
                'январь-июнь': 'январь-март',
                'январь-сентябрь': 'январь-июнь',
                'январь-декабрь': 'январь-сентябрь',
            }
        }
    },
    async mounted() {
        const passport = new RegionPassport()
        await store.dispatch('fetch_geodata_region', this.region_id)
        this.data = await passport.list({file: this.file, region: this.region_id})
        store.commit("basic", {key: 'loading', value: false})
    },
    computed: {
        region: () => store.state.region,
        loading: () => store.state.loading,
        year: () => store.state.selected_year,
        kvartal() {
            return store.state.selected_file.period && store.state.selected_file.period.translations[this.$i18n.locale] ? 
            store.state.selected_file.period.translations[this.$i18n.locale].name.split(' ')[0].toLowerCase() : 
            store.state.selected_file.name
        }
    },
    methods: {
        search_criteria(data, text) {
            for (let d of Object.values(data)) {
                if (d.criteria.translations['uz-cl'].name === text && d.region.id == this.region_id) {
                    return d.translations[this.$i18n.locale].value
                }
            }
            return '0'
        },
        search_label(data, id) {
            if (data[id]) {
                return data[id].criteria.translations[this.$i18n.locale].name
            }
        },
        search_value(data, id) {
            if (data[id]) {
                return data[id].translations[this.$i18n.locale].value
            }
            return ''
        }
    }
}
</script>