import axios from "@/plugins/axios";

export default {
    state: {
        token: "",
    },
    getters: {
        get_token: (state) => localStorage.getItem('access'),
    },
    actions: {
        async uuidv4() {
            return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
                (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
            );
        },
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
