import { createStore } from "vuex";

const store = createStore({
    state: {
        user: null,
        token: null
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
        setToken(state, token) {
            state.token = token;
        },
        logoutUser(state) {
            state.user = null;
            state.token = null;
        },
        restoreState(state, savedState) {
            Object.assign(state, savedState);
        }
    },
    actions: {
        loginUser({ commit }, { user, token }) {
            commit('setUser', user);
            commit('setToken', token);
        },
        logoutUser({ commit }) {
            commit('logoutUser');
        },
        restoreState({ commit }) {
            const savedState = JSON.parse(localStorage.getItem('store'));
            if (savedState) {
                commit('restoreState', savedState);
            }
        }
    },
    getters: {
        getUserId(state) {
            return state.user ? state.user.userId : null; 
        },
        getUser(state) {
            return state.user;
        },
        getToken(state) {
            return state.token;
        }
    }
});

// Vuex store'u tarayıcı hafızasına kaydetmek için subscribe işlemi
store.subscribe((mutation, state) => {
    localStorage.setItem('store', JSON.stringify(state));
});

// Oturum bilgilerini geri yükle
store.dispatch('restoreState');

export default store;
