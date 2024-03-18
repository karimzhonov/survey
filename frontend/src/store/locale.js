export default {
  state: {
    lang: '',
    languages: [
        {
          lang: 'Русский', code: 'ru',
        },
        {
          lang: 'O\'zbekcha', code: 'uz'
        },
      ],
  },
  mutations: {
    select_lang(state, {lang, i18n}) {
      state.lang = lang
      localStorage.setItem('lang', lang)
      i18n.locale = lang
    }
  },
  getters: {
    get_selected_lang: (state) => state.lang,
    get_languages: (state) => state.languages,
  },
  actions: {
  },
};
