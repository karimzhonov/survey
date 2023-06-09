<script setup>
import { computed, defineProps } from 'vue';
import AppTopbar from './AppTopbar.vue';
import { useLayout } from '@/layout/composables/layout';
import router from '@/router';

const { layoutConfig, layoutState } = useLayout();

const props = defineProps(['lang'])

const lang = computed(() => {
    if (['ru', 'uz-cl', "uz"].includes(props.lang)) {
        return props.lang
    }
    router.push({to: 'home', params: {lang: 'uz-cl'}})
    return 'ru'
})

const containerClass = computed(() => {
    return {
        'layout-theme-light': layoutConfig.darkTheme.value === 'light',
        'layout-theme-dark': layoutConfig.darkTheme.value === 'dark',
        'layout-overlay': layoutConfig.menuMode.value === 'overlay',
        'layout-static': layoutConfig.menuMode.value === 'static',
        'layout-static-inactive': layoutState.staticMenuDesktopInactive.value && layoutConfig.menuMode.value === 'static',
        'layout-overlay-active': layoutState.overlayMenuActive.value,
        'layout-mobile-active': layoutState.staticMenuMobileActive.value,
        'p-input-filled': layoutConfig.inputStyle.value === 'filled',
        'p-ripple-disabled': !layoutConfig.ripple.value
    };
});
</script>

<template>
    <div class="layout-wrapper" :class="containerClass">
        <app-topbar :lang="lang"></app-topbar>
        <div class="layout-main-container" style="width: 100%; margin-left: 0px; padding: 5rem 0 0 0">
            <div class="layout-main">
                <router-view :key="$route.fullPath"></router-view>
            </div>
        </div>
        <div class="layout-mask"></div>
    </div>
</template>

<style lang="scss" scoped></style>
