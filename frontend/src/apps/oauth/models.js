import store from "@/store";
import router from "@/router";
import axios from "@/plugins/axios";

export async function create_token(username, password) {
    const response = await axios.post('/api/oauth/auth/', {username, password})
    store.commit('basic', {key: 'token', value: response.data.access})
    await router.push({name: 'home'})
    return response.data
}

export async function refresh_token(refresh_token) {
    try {
        const r = await axios.post('/api/oauth/refresh-token/', {refresh: refresh_token})
        context.commit('basic', {key: 'token', value: r.data.access})
        localStorage.setItem('access', r.data.access)
    } catch (e) {
        await router.push({name: 'login'})
        throw e
    }
}
