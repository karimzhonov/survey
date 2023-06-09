import axios from "@/plugins/axios";

export default {
    state: {
        token: "",
    },
    getters: {
        get_token: (state) => localStorage.getItem('access'),
    },
    actions: {
        async login(context, {username, password}) {
            const response = await axios.post('/api/oauth/auth/', {
                username, password
            })
            context.commit('basic', {key: 'token', value: response.data.access})
            return response.data
        },
        async refresh_token(context, refresh_token) {
            try {
                const r = await axios.$api.post('/api/oauth/refresh-token/', {refresh: refresh_token})
                context.commit('basic', {key: 'token', value: r.data.access})
                localStorage.setItem('access', r.data.access)
            } catch (e) {
                await axios.go_to_login()
                throw e
            }
        }
    },
};
