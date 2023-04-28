export default {
    state: {
        messages: [],
        message_icon_list: {
            1: 'pi pi-times-circle',
            2: 'pi pi-info-circle',
            3: 'pi pi-exclamation-triangle',
            4: 'pi pi-check'
        }
    },
    actions: {
        async add_error_message(context, message) {
            context.commit('append_message', {
                severity: 'error',
                closable: true,
                icon: context.state.message_icon_list[1],
                content: message
            })
        },
        async _add_message(context, message) {
            const type_list = {
                1: 'error', 2: 'info', 3: 'warn', 4: 'success'
            }
            context.commit('append_message', {
                severity: type_list[message.type],
                closable: true,
                icon: context.state.message_icon_list[message.type],
                content: message.message
            })
        },
        async add_message(context, messages) {
            if (Array.isArray(messages)) {
                for (let message of messages) {
                    await context.dispatch('_add_message', message)
                }
            } else if (typeof messages === 'object') {
                await context.dispatch('_add_message', messages)
            } else {
                await context.dispatch('_add_message', {
                    name: messages,
                    desc: messages,
                    type: 1
                })
            }

        }
    },
    mutations: {
        append_message(state, message) {
            state.messages.push(message)
        }
    },
    getters: {
        get_messages: (state) => state.messages
    }
}