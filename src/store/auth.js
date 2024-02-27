import { createStore } from "vuex";

const savedState = localStorage.getItem('store');

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
        restoreState(state, savedState) {
          Object.assign(state, savedState);
        }
      },
      actions: {
        loginUser({ commit }, { user, token }) {
          commit('setUser', user);
          commit('setToken', token);
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

if (savedState) {
  store.commit('restoreState', JSON.parse(savedState));
}

store.subscribe((mutation, state) => {
  localStorage.setItem('store', JSON.stringify(state));
});

export default store;
