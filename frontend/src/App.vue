<script>
import store from './store';
import {useLayout} from '@/layout/composables/layout';

export default {
    name: 'App',
    computed: {
        messages: () => store.getters.get_messages
    },
    mounted() { 
        store.commit('basic', {key: 'token', value: localStorage.getItem('access')})

        const {changeThemeSettings, layoutConfig} = useLayout();
        const url = new URL(window.location.href)
        if (url.searchParams.get('light') !== null) {
            const mode = url.searchParams.get('light') === '0' ? false : true
            store.commit('basic', {key: 'darkMode', value: true})
            const theme = mode ? 'lara-light-indigo' : 'lara-dark-indigo'
            localStorage.setItem('dark', !mode)
            const elementId = 'theme-css';
            const linkElement = document.getElementById(elementId);
            const cloneLinkElement = linkElement.cloneNode(true);
            const newThemeUrl = linkElement.getAttribute('href').replace(layoutConfig.theme.value, theme);
            cloneLinkElement.setAttribute('id', elementId + '-clone');
            cloneLinkElement.setAttribute('href', newThemeUrl);
            cloneLinkElement.addEventListener('load', () => {
                linkElement.remove();
                cloneLinkElement.setAttribute('id', elementId);
                changeThemeSettings(theme, mode);
            });
            linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);
        }
    }
}
</script>

<template>
    <Message class="position-absolute" style="left: 15%; right: 15%; z-index: 2000;"  v-for="msg of messages" :severity="msg.severity" :key="msg.content"
           :closable="msg.closable" :icon="msg.icon" :sticky="false"><p style="color: #000">{{ msg.content }}</p></Message>
    <div v-if="!$route.path.startsWith('/frame')" class="p-message-success text-center test-item">{{ $t('Сайт работает в тестовом режиме, приносим извинения за возможные неудобства') }}</div>
    <router-view />
</template>

<style scoped>
.test-item {
    font-size: 1vh;
    line-height: 2vh;
    position: fixed;
    bottom: 0;
    width: 100vw;
    z-index: 10;
    background-color: #86EFAC;
    color: black;
    padding: 5px;
}
</style>