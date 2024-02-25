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
        }
      },
      actions: {
        loginUser({ commit }, { user, token }) {
          commit('setUser', user);
          commit('setToken', token);
        }
      },
      getters: {
        getUser(state) {
          return state.user;
        },
        getToken(state) {
          return state.token;
        }
      }
})

export default store