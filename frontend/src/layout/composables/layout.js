import { toRefs, reactive, computed } from 'vue';

const contextPath = process.env.VUE_APP_BASE_URL;
const layoutConfig = reactive({
    ripple: false,
    darkTheme: window.matchMedia("(prefers-color-scheme:dark)").matches,
    inputStyle: 'outlined',
    menuMode: 'static',
    theme: window.matchMedia("(prefers-color-scheme:dark)").matches ? 'lara-dark-indigo' : 'lara-light-indigo',
    scale: 14,
    activeMenuItem: null,
    loading: true,
});

const layoutState = reactive({
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    profileSidebarVisible: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false
});

export function useLayout() {
    const changeThemeSettings = (theme, darkTheme) => {
        layoutConfig.darkTheme = darkTheme;
        layoutConfig.theme = theme;
    };

    const setScale = (scale) => {
        layoutConfig.scale = scale;
    };

    const setActiveMenuItem = (item) => {
        layoutConfig.activeMenuItem = item.value || item;
    };
    const onMenuToggle = () => {
        layoutConfig.key += 1
        if (layoutConfig.menuMode === 'overlay') {
            layoutState.overlayMenuActive = !layoutState.overlayMenuActive;
        }

        if (window.innerWidth > 991) {
            layoutState.staticMenuDesktopInactive = !layoutState.staticMenuDesktopInactive;
        } else {
            layoutState.staticMenuMobileActive = !layoutState.staticMenuMobileActive;
        }

    };

    const isSidebarActive = computed(() => layoutState.overlayMenuActive || layoutState.staticMenuMobileActive);

    const isDarkTheme = computed(() => layoutConfig.darkTheme);
    return { contextPath, layoutConfig: toRefs(layoutConfig), layoutState: toRefs(layoutState), changeThemeSettings, setScale, onMenuToggle, isSidebarActive, isDarkTheme, setActiveMenuItem };
}
