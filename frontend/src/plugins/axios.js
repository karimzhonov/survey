import axios from "axios";
import store from "@/store";
import router from "@/router";

const $api = axios.create({
    baseURL: process.env.VUE_APP_BACKEND_HOST,
});

export default {
    $api,
    async raise_error_400(data) {
        if (data.detail) {
            for (let message of data.detail) {
                await store.dispatch('add_error_message', message)
            }
        }
        delete data.detail
        for (let key in data) {
            if (document.getElementById(`${key}_error`)){
                document.getElementById(`${key}_error`).innerText = Array.isArray(data[key]) ? data[key].join('. ') : data[key]
            }
        }
    },
    async go_to_login() {
        router.push({name: 'login', query: {next: window.location.href}})
    },
    async raise_error(response) {
        if (response.status === 401) {
            if (localStorage.getItem('refresh')) {
                await store.dispatch('refresh_token', localStorage.getItem('refresh'))
                return
            }
            console.log(window.location);
            if (document.referrer !== 'https://panel.tashkent.uz/') {
                await this.go_to_login()
            }
        } else if (response.status === 400) {
            await this.raise_error_400(response.data)
        }
        throw response.data
    },
    async delete_errors(){
        for (let element of document.querySelectorAll('[id$=_error]')) {
            element.innerText = ''
        }
    },
    async get_headers() {
        this.delete_errors()
        const headers = {}
        headers['Accept-Language'] = localStorage.getItem('lang') ?? 'ru'
        if (document.referrer === 'https://panel.tashkent.uz/' || window.location.pathname.startsWith('/frame')) {
            headers['Authorization'] = `Basic ${process.env.VUE_APP_FRAME_USERNAME}:${process.env.VUE_APP_FRAME_PASSWORD}`
        } else {
            if (localStorage.getItem('access')) {
                headers['Authorization'] = `Bearer ${localStorage.getItem('access')}`
            }
        }
        return headers
    },
    async get(url, options = {}) {
        options.headers = await this.get_headers();
        try {
            return await $api.get(url, options);
        } catch (e) {
            console.log(e);
            await this.raise_error(e.response);
            return await this.get(url, options)
        }
    },
    async post(url, data, options = {}) {
        options.headers = await this.get_headers();
        try {
            return await $api.post(url, data, options);
        } catch (e) {
            console.log(e);
            await this.raise_error(e.response);
            return await this.post(url, data, options)
        }
    },
    async patch(url, data, options = {}) {
        options.headers = await this.get_headers();
        try {
            return await $api.patch(url, data, options);
        } catch (e) {
            console.log(e);
            await this.raise_error(e.response);
            return await this.patch(url, data, options)
        }
    },
    async delete(url, options = {}) {
        options.headers = await this.get_headers();
        try {
            return await $api.delete(url, options);
        } catch (e) {
            console.log(e);
            await this.raise_error(e.response);
            return await this.delete(url, options)
        }
    },
    async head(url, options = {}) {
        options.headers = await this.get_headers();
        try {
            return await $api.head(url, options);
        } catch (e) {
            console.log(e);
            await this.raise_error(e.response);
        }
    },
};
