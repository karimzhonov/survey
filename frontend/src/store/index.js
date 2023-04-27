import {createStore} from "vuex";
import locale from "@/store/locale";
import auth from "@/store/auth";
import message from "@/store/message";
import sidebar from "@/store/sidebar";

export default createStore({
    state: {
        files: [], data: [], selectedFiles: [], loading: true, 
        selected_year: {}, top_bar_years: [], selected_file: {},
        data_table: [],
        darkMode: window.matchMedia("(prefers-color-scheme:dark)").matches,
        messages: [],
    },
    getters: {},
    mutations: {
        basic(state, {key, value}) {
            state[key] = value;
        },
        add_main_data(state, data) {
            const uploads = state.data.reduce((a, v) => [...a, v[0].upload.id], [])
            if (!uploads.includes(data[0].upload.id)) {
                state.data.push(data)
            }
        },
    },
    actions: {
        get_random_color() {
            return "#" + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0")
        },
        async get_gradient_color(context, value) {
            const all_colors = ["#EE391F", "#EE391F", "#EE391F", "#EE391F", "#EE391F", "#FAA10B", "#FAB807", "#F1E000", "#A4D12A", "#27B973"]
            return all_colors[Math.round(value * 10) - 1]
        },
    },
    modules: {
        locale,
        auth,
        message,
        sidebar,
    },
});
